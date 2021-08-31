/*global W, Mousetrap, require, WazeWrap*/

(function wrwh() {
  const WHATS_NEW = `<b>What's new?</b>
    <br>- 0.1.0 Initial release`;

  let UpdateObject = null;
  let panelDisplayed = null;
  //const panelID = Symbol.for("wme_roads_helper");
  const panelDiv = document.createElement('div');
  const INCREASE = '+';
  const DECREASE = '-';
  const safeAlert = (level, message) => {
    try {
      WazeWrap.Alerts[level](GM_info.script.name, message);
    } catch (e) {
      console.error(e);
      alert(message);
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitForWazeWrap() {
    let trials = 1;
    let sleepTime = 150;
    do {
      if (!WazeWrap || WazeWrap.Ready !== true) {
        console.log('WRWH: WazeWrap not ready, retrying...');
        await sleep(trials * sleepTime);
      } else {
        return true;
      }
    } while (trials++ <= 30);
    throw new Error('Could not initialize WazeWrap');
  }

  function initWazeWrap() {
    // Here is safe to use WazeWrap
    WazeWrap.Interface.ShowScriptUpdate(
      GM_info.script.name,
      GM_info.script.version,
      WHATS_NEW,
      '',
      GM_info.script.supportURL
    );
    for (let i = 1; i < 10; i++) {
      new WazeWrap.Interface.Shortcut(
        `set-${i}-lane`,
        `Set selected one-way segments as ${i} Lane width`,
        'WRWH',
        'WME Roads Width Helper',
        `${i}`,
        () => {
          setLaneWidthOnSelectedSegments(i);
          return false;
        },
        null
      ).add();
    }

    new WazeWrap.Interface.Shortcut(
      'remove-lanes',
      'Remove (width-related) lanes from selected segments',
      'WRWH',
      'WME Roads Width Helper',
      '0',
      () => {
        setLaneWidthOnSelectedSegments(0);
        return false;
      },
      null
    ).add();
    /*
        new WazeWrap.Interface.Shortcut(
        'increase-lanes',
        'Increase the lanes\' width of 0,1',
        'WRWH',
        'WME Roads Width Helper',
        '+',
        () => {
          changeLaneWidthOnSelectedSegments(INCREASE); return false;
        },
        null
      ).add();
            new WazeWrap.Interface.Shortcut(
        'decrease-lanes',
        'Decrease the lanes\' width of 0,1',
        'WRWH',
        'WME Roads Width Helper',
        '-',
        () => {
          changeLaneWidthOnSelectedSegments(DECREASE); return false;
        },
        null
      ).add();
      */
    console.log(
      'WME Roads Width Helper: Keyboard shortcuts successfully added'
    );
  }

  function init() {
    UpdateObject = require('Waze/Action/UpdateObject');

    waitForWazeWrap().then((result) => {
      if (result === true) {
        initWazeWrap();
      }
    });

    /*
        Mousetrap.bind('1', function(){setLaneWidthOnSelectedSegments(1); return false;});
        Mousetrap.bind('2', function(){setLaneWidthOnSelectedSegments(2); return false;});
        Mousetrap.bind('3', function(){setLaneWidthOnSelectedSegments(3); return false;});
        Mousetrap.bind('4', function(){setLaneWidthOnSelectedSegments(4); return false;});
        Mousetrap.bind('5', function(){setLaneWidthOnSelectedSegments(5); return false;});
        Mousetrap.bind('6', function(){setLaneWidthOnSelectedSegments(6); return false;});
        Mousetrap.bind('7', function(){setLaneWidthOnSelectedSegments(7); return false;});
        Mousetrap.bind('8', function(){setLaneWidthOnSelectedSegments(8); return false;});
        Mousetrap.bind('9', function(){setLaneWidthOnSelectedSegments(9); return false;});
        Mousetrap.bind('0', function(){setLaneWidthOnSelectedSegments(0); return false;});
        */
    //plus and minus don't seem to be valid shortcuts on the editor.
    Mousetrap.bind('+', function () {
      changeLaneWidthOnSelectedSegments(INCREASE);
      return false;
    });
    Mousetrap.bind('-', function () {
      changeLaneWidthOnSelectedSegments(DECREASE);
      return false;
    });
    console.log('WME Roads Width Helper: init completed');
  }

  function isPanelDisplayed() {
    return panelDisplayed !== null && panelDiv.style.display !== 'none';
  }

  function displayPanel() {
    if (panelDisplayed === null) {
      //First time
      panelDiv.className = 'panel';
      panelDiv.style.cssText = `position: fixed;
            opacity: 0.8;
            z-index: 100;
            background: #fff;
            width: 220px;
            border-radius: 5px;
            border: 1px solid #000;
            padding: 4px;
            cursor: auto;
            bottom: 10vh;
            left: 400px`;
      panelDiv.innerHTML = `<a id="WRWH_close" class="close-panel"></a><h6 title="Version ${GM_info.script.version}">Road Width Helper</h6>
            <label for="WRWH_laneWidth" title="If empty, it will use the default values set for your country. When set, the script uses the given values for all road types.">Width</label>
            <input type="number" id="WRWH_laneWidth" class="form-control" min="1.0" max="15" step="0.1" placeholder="WME's default"/><br>
            <div style="display:inline-block;"><label for="WRWH_apply_default" title="If checked, the current WME's default value is inserted into the lane width input. This prevents it from being overwritten in the future if this value changes in your country.">Apply default value</label>&nbsp;&nbsp;<input type="checkbox" id="WRWH_apply_default" checked/></div>
            <div style="display:inline-block;"><label for="WRWH_apply_default" title="If unchecked, confirmation alerts are not shown.">Display alerts</label>&nbsp;&nbsp;<input type="checkbox" id="WRWH_display_alerts" checked/></div>`;
      if (!W.map.getLayerByName('Street Vector Layer')) {
        panelDiv.innerHTML +=
          '<div style="color:red;">Street Vector Layer not found. <a href="https://github.com/bedo2991/svl/releases/latest/download/release.user.js" target="_blank">Please consider installing it</a> to see the roads width.</div>';
      }
      document.body.appendChild(panelDiv);
      document
        .getElementById('WRWH_close')
        .addEventListener('click', hidePanel);
      panelDisplayed = true;
    } else if (panelDisplayed === false) {
      panelDiv.style.display = 'block';
      panelDisplayed = true;
    }
  }

  function hidePanel() {
    if (panelDisplayed !== null) {
      panelDiv.style.display = 'none';
      panelDisplayed = false;
    }
  }

  function changeLaneWidthOnSelectedSegments(increaseOrDecrease) {
    if (!isPanelDisplayed()) {
      displayPanel();
    }
    let selectedFeatures = W.selectionManager.getSelectedFeatures();
    for (var i = 0; i < selectedFeatures.length; i++) {
      if (selectedFeatures[i].model.type === 'segment') {
        applyLaneWidth(selectedFeatures[i].model, null, increaseOrDecrease);
      }
    }
  }

  function setLaneWidthOnSelectedSegments(numberOfLanes) {
    if (!isPanelDisplayed()) {
      displayPanel();
    }
    let selectedFeatures = W.selectionManager.getSelectedFeatures();
    let userWidthValue = document.getElementById('WRWH_laneWidth').value;
    if (!userWidthValue) {
      userWidthValue = null;
    }
    if (document.getElementById('WRWH_display_alerts').checked) {
      if (numberOfLanes === 0) {
        safeAlert(
          'warning',
          `Removing (width-related) lanes from the selected one-way segments.`
        );
      } else {
        safeAlert(
          'info',
          `Setting ${numberOfLanes} lanes on the selected one-way segments.`
        );
      }
    }
    for (let i = 0; i < selectedFeatures.length; i++) {
      if (selectedFeatures[i].model.type === 'segment') {
        if (numberOfLanes === 0) {
          deleteLaneWidth(selectedFeatures[i].model);
        } else {
          applyLaneWidth(
            selectedFeatures[i].model,
            numberOfLanes > 0 ? numberOfLanes : null,
            userWidthValue
          );
        }
      }
    }
  }

  function deleteLaneWidth(seg) {
    let details = {};
    if (!seg.isOneWay()) {
      console.log('Only one-way segments are currently supported.');
      safeAlert(
        'warning',
        'Sorry, currently only one-way segments are supported.'
      );
      return;
    }
    if (seg.attributes.fwdDirection) {
      details.fromLanesInfo = null;
    } else {
      details.toLanesInfo = null;
    }
    try {
      W.model.actionManager.add(new UpdateObject(seg, details));
      //console.log("Details updated");
    } catch (e) {
      console.log('Error! Could not update segment details');
      console.dir(e);
    }
  }

  function applyLaneWidth(seg, numberOfLanes = null, laneWidthInMeters = null) {
    if (!seg.isOneWay()) {
      //console.log("Only one-way segments are currently supported.");
      safeAlert(
        'warning',
        'Sorry, currently only one-way segments are supported.'
      );
      return;
    }
    var details = {};
    let laneWidth = null;
    //Check is segment already has a width value
    if (laneWidthInMeters === null) {
      if (seg.attributes.fwdDirection) {
        laneWidth = seg.attributes.fromLanesInfo?.laneWidth; // ?? W.model.topCountry.defaultLaneWidthPerRoadType[seg.attributes.roadType];
      } else {
        laneWidth = seg.attributes.toLanesInfo?.laneWidth; // ?? W.model.topCountry.defaultLaneWidthPerRoadType[seg.attributes.roadType];
      }
    } else if (
      laneWidthInMeters === INCREASE ||
      laneWidthInMeters === DECREASE
    ) {
      if (seg.attributes.fwdDirection) {
        laneWidth =
          seg.attributes.fromLanesInfo?.laneWidth ??
          W.model.topCountry.defaultLaneWidthPerRoadType[
            seg.attributes.roadType
          ];
      } else {
        laneWidth =
          seg.attributes.toLanesInfo?.laneWidth ??
          W.model.topCountry.defaultLaneWidthPerRoadType[
            seg.attributes.roadType
          ];
      }
    }

    if (laneWidthInMeters === INCREASE) {
      laneWidth += 10;
    } else if (laneWidthInMeters === DECREASE) {
      laneWidth -= 10;
    } else if (!isNaN(parseFloat(laneWidthInMeters))) {
      laneWidth = laneWidthInMeters * 100;
    }

    //console.log(`Setting ${numberOfLanes} lanes ${laneWidth} m width.`);
    const applyDefault = document.getElementById('WRWH_apply_default').checked;
    if (!applyDefault) {
      laneWidth =
        W.model.topCountry.defaultLaneWidthPerRoadType[
          seg.attributes.roadType
        ] === laneWidth
          ? null
          : laneWidth;
    } else if (laneWidth === null || typeof laneWidth === 'undefined') {
      laneWidth =
        W.model.topCountry.defaultLaneWidthPerRoadType[seg.attributes.roadType];
    }
    if (seg.attributes.fwdDirection) {
      if (numberOfLanes === null) {
        numberOfLanes = seg.attributes.fromLanesInfo?.numberOfLanes ?? 1;
      }
      details.fromLanesInfo = { numberOfLanes: numberOfLanes, laneWidth };
      if (
        details.fromLanesInfo.numberOfLanes ===
          seg.attributes.fromLanesInfo?.numberOfLanes &&
        details.fromLanesInfo.laneWidth ===
          seg.attributes.fromLanesInfo?.laneWidth
      ) {
        //No changes
        return;
      }
    } else if (seg.attributes.revDirection) {
      if (numberOfLanes === null) {
        numberOfLanes = seg.attributes.toLanesInfo?.numberOfLanes ?? 1;
      }
      details.toLanesInfo = { numberOfLanes: numberOfLanes, laneWidth };
      if (
        details.toLanesInfo.numberOfLanes ===
          seg.attributes.toLanesInfo?.numberOfLanes &&
        details.toLanesInfo.laneWidth === seg.attributes.toLanesInfo?.laneWidth
      ) {
        //No changes
        return;
      }
    }
    try {
      W.model.actionManager.add(new UpdateObject(seg, details));
      console.log('Details updated');
    } catch (e) {
      console.log('Error! Could not update segment details');
      console.dir(e);
    }
  }
  function bootstrap(counter = 0) {
    if (W && typeof require === 'function') {
      init();
    } else if (counter < 15) {
      console.log(
        'WME Roads Width Helper: attempt ' +
          counter +
          ' failed. Trying again in 1 second'
      );
      setTimeout(() => {
        bootstrap(++counter);
      }, 1000);
    } else {
      console.error('Could not initialize WME Roads Width Helper :(');
    }
  }
  bootstrap();
})();
