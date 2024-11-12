import { WmeSDK } from "wme-sdk-typings";




(function wrwh() {

  // the sdk initScript function will be called after the SDK is initialized
  window.SDK_INITIALIZED.then(initScript);
  function initScript() {

    if (!window.getWmeSdk) {
      // This block is required for type checking, but it is guaranteed that the function exists.
      throw new Error("SDK not available");
    }
    const wmeSDK: WmeSDK = window.getWmeSdk(
      {
        scriptId: "WRWH",
        scriptName: "WME Road Width Helper"
      }
    )
    const WHATS_NEW = `<b>What's new?</b>
    <br>- 1.0.0 Start using the new WME SDK
    <br>- 0.4.5 Don't change roadwidth when editing is not enabled`;
    const SCRIPT_ABBREVIATION = 'WRWH';

    let UpdateObject = null;
    let panelDisplayed: (null | boolean) = null;
    //const panelID = Symbol.for("wme_roads_helper");
    const panelDiv = document.createElement('div');
    const INCREASE = '+';
    const DECREASE = '-';
    const safeAlert = (level: string, message: string) => {
      try {
        WazeWrap.Alerts[level](GM_info.script.name, message);
      } catch (e) {
        console.error(e);
        alert(message);
      }
    };

    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function waitForWazeWrap() {
      let trials = 1;
      let sleepTime = 150;
      do {
        if (!WazeWrap || WazeWrap.Ready !== true) {
          console.log(`${SCRIPT_ABBREVIATION}: WazeWrap not ready, retrying...`);
          await sleep(trials * sleepTime);
        } else {
          return true;
        }
      } while (trials++ <= 30);
      throw new Error('Could not initialize WazeWrap');
    }

    function initKeyboardShortcuts() {
      for (let i = 1; i < 10; i++) {
        wmeSDK.Shortcuts.createShortcut({
          callback: () => {
            setLaneWidthOnSelectedSegments(i);
            return false;
          },
          description: `Set selected segments as ${i} lane width`,
          shortcutId: `${SCRIPT_ABBREVIATION}-set-${i}-lane`,
          shortcutKeys: i.toString(),
        });
      }

      wmeSDK.Shortcuts.createShortcut({
        callback: () => {
          setLaneWidthOnSelectedSegments(0);
          return false;
        },
        description: "Remove (width-related) lanes from selected segments",
        shortcutId: SCRIPT_ABBREVIATION + "_remove_lanes",
        shortcutKeys: "0",
      });

      wmeSDK.Shortcuts.createShortcut({
        callback: () => {
          changeLaneWidthOnSelectedSegments(INCREASE);
        },
        description: "Increase the segment's lane width",
        shortcutId: SCRIPT_ABBREVIATION + "_increase",
        shortcutKeys: "187",
      });

      wmeSDK.Shortcuts.createShortcut({
        callback: () => {
          changeLaneWidthOnSelectedSegments(DECREASE);
        },
        description: "Decrease the segment's lane width",
        shortcutId: SCRIPT_ABBREVIATION + "_decrease",
        shortcutKeys: "189",
      });

      console.log(
        `${GM_info.script.name}: Keyboard shortcuts successfully added`
      );
    }

    function initWazeWrap() {
      // Here is safe to use WazeWrap

      WazeWrap.Interface.ShowScriptUpdate(
        GM_info.script.name,
        GM_info.script.version,
        WHATS_NEW,
        '',
        (GM_info.script.supportURL ? GM_info.script.supportURL : undefined)
      );
    }

    function init() {
      UpdateObject = require('Waze/Action/UpdateObject');

      initKeyboardShortcuts();

      waitForWazeWrap().then((result) => {
        if (result === true) {
          initWazeWrap();
        }
      });


      console.log(`${GM_info.script.name}: init completed`);
    }

    function isPanelDisplayed() {
      return panelDisplayed !== null && panelDiv.style.display !== 'none';
    }

    function makeID(name) {
      return `${SCRIPT_ABBREVIATION}_${name}`;
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
        panelDiv.innerHTML = `<a id="${makeID(
          'close'
        )}" class="close-panel"></a><h6 title="Version ${GM_info.script.version
          }">${GM_info.script.name.substring(4)}</h6>
            <label for="${makeID(
            'laneWidth'
          )}" title="If empty, it will use the default values set for your country. When set, the script uses the given values for all road types.">Width (in m)</label>
            <input type="number" id="${makeID(
            'laneWidth'
          )}" class="form-control" min="1.0" max="10" step="0.05" placeholder="WME's default"/><br>
            <div style="display:inline-block;"><label for="${makeID(
            'apply_default'
          )}" title="If checked, the current WME's default value is inserted into the lane width input, if the script width field is left empty.\nThis prevents it from being overwritten in the future if this value changes in your country.">Apply default value</label>&nbsp;&nbsp;<input type="checkbox" id="${makeID(
            'apply_default'
          )}" checked/></div>
            <div style="display:inline-block;"><label for="${makeID(
            'apply_default'
          )}" title="If unchecked, confirmation alerts are not shown.">Display alerts</label>&nbsp;&nbsp;<input type="checkbox" id="${makeID(
            'display_alerts'
          )}" checked/></div>`;
        try {
          if (!W.map.getLayerByName('Street Vector Layer')) {
            panelDiv.innerHTML +=
              '<div style="color:red;">Street Vector Layer not found. <a href="https://github.com/bedo2991/svl/releases/latest/download/release.user.js" target="_blank">Please consider installing it</a> to see the roads width.</div>';
          }
        }
        catch (ex) {
          console.error("Error checking for Street Vector Layer");
        }
        panelDiv.innerHTML += `<p><a href="${GM_info.script.supportURL}" target="_blank">${SCRIPT_ABBREVIATION} support forum</a></p>`;
        document.body.appendChild(panelDiv);
        (document
          .getElementById(makeID('close')) as HTMLAnchorElement)
          .addEventListener('click', hidePanel);
        (document
          .getElementById(makeID('laneWidth')) as HTMLInputElement)
          .addEventListener('change', toggleApplyDefault);
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

    function toggleApplyDefault(e) {
      const applyDefaultValue = document.getElementById(makeID('apply_default')) as HTMLInputElement;
      if (e.target.value > 0) {
        applyDefaultValue.setAttribute('disabled', 'disabled');
        applyDefaultValue.title =
          'Delete the manually entered width to use this checkbox';
      } else {
        applyDefaultValue.title = "";
        applyDefaultValue.removeAttribute('disabled');
      }
    }

    function changeLaneWidthOnSelectedSegments(increaseOrDecrease: string) {
      if (!isPanelDisplayed()) {
        displayPanel();
      }
      const segments = W.selectionManager.getSegmentSelection().segments;
      for (var i = 0; i < segments.length; i++) {
        applyLaneWidth(segments[i], null, increaseOrDecrease);
      }
    }

    function setLaneWidthOnSelectedSegments(numberOfLanes: number) {
      // If the user can't currently edit (e.g. house numbers editing)
      if (wmeSDK.Editing.isEditingHouseNumbers() || wmeSDK.Editing.isPracticeModeOn() || wmeSDK.Editing.isSnapshotModeOn())
        return;

      if (!isPanelDisplayed()) {
        displayPanel();
      }

      const selection = wmeSDK.Editing.getSelection();
      const segments = W.selectionManager.getSegmentSelection().segments;
      if (!selection || selection?.objectType !== "segment") {
        return safeAlert(
          'warning',
          `You must select at least one segment, first`
        );
      }

      let userWidthValue: (string | null) = (document
        .getElementById(makeID('laneWidth')) as HTMLInputElement).value;
      if (!userWidthValue) {
        userWidthValue = null;
      }
      if ((document.getElementById(makeID('display_alerts')) as HTMLInputElement).checked) {
        if (numberOfLanes === 0) {
          safeAlert(
            'warning',
            `Removing (width-related) lane(s) from the selected segment(s).`
          );
        } else {
          safeAlert(
            'info',
            `Setting ${numberOfLanes} lane(s) on the selected segment(s).`
          );
        }
      }
      for (let i = 0; i < segments.length; i++) {
        if (numberOfLanes === 0) {
          deleteLaneWidth(segments[i]);
        } else {
          applyLaneWidth(
            segments[i],
            numberOfLanes > 0 ? numberOfLanes : null,
            userWidthValue
          );
        }
      }
    }

    function deleteLaneWidth(seg) {
      let details = {};
      /*if (false && !seg.isOneWay()) {
        //console.log('Only one-way segments are currently supported.');
        safeAlert(
          'warning',
          'Sorry, currently only one-way segments are supported.'
        );
        return;
      }*/
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

    function applyLaneWidth(seg, numberOfLanes: (number | null) = null, laneWidthInMeters: (null | number | string) = null) {
      /*if (false && !seg.isOneWay()) {
        //console.log("Only one-way segments are currently supported.");
        safeAlert(
          'warning',
          'Sorry, currently only one-way segments are supported.'
        );
        return;
      }*/
      var details = {};
      let laneWidthFwd = null;
      let laneWidthRev = null;
      //Check is segment already has a width value
      if (laneWidthInMeters === null) {
        if (seg.attributes.fwdDirection) {
          laneWidthFwd = seg.attributes.fromLanesInfo?.laneWidth; // ?? W.model.topCountry.attributes.defaultLaneWidthPerRoadType[seg.attributes.roadType];
        }
        if (seg.attributes.revDirection) {
          laneWidthRev = seg.attributes.toLanesInfo?.laneWidth; // ?? W.model.topCountry.attributes.defaultLaneWidthPerRoadType[seg.attributes.roadType];
        }
      } else if (
        laneWidthInMeters === INCREASE ||
        laneWidthInMeters === DECREASE
      ) {
        if (seg.attributes.fwdDirection) {
          laneWidthFwd =
            seg.attributes.fromLanesInfo?.laneWidth ??
            W.model.topCountry.attributes.defaultLaneWidthPerRoadType[
            seg.attributes.roadType
            ];
        }
        if (seg.attributes.revDirection) {
          laneWidthRev =
            seg.attributes.toLanesInfo?.laneWidth ??
            W.model.topCountry.attributes.defaultLaneWidthPerRoadType[
            seg.attributes.roadType
            ];
        }
      } else {
        if (seg.attributes.fwdDirection) {
          laneWidthFwd = laneWidthInMeters * 100;
        }
        if (seg.attributes.revDirection) {
          laneWidthRev = laneWidthInMeters * 100;
        }
      }

      let delta = 0;
      if (laneWidthInMeters === INCREASE) {
        delta = 10;
      } else if (laneWidthInMeters === DECREASE) {
        delta = -10;
      }

      if (laneWidthInMeters === INCREASE || laneWidthInMeters === DECREASE) {
        if (laneWidthFwd !== null) {
          laneWidthFwd += delta;
        }
        if (laneWidthRev !== null) {
          laneWidthRev += delta;
        }
      }

      // console.log(`Setting ${numberOfLanes} lanes ${laneWidth} m width.`);
      const applyDefault = document.getElementById(
        makeID('apply_default')
      ).checked;
      if (!applyDefault) {
        // if the value I want to apply is the same as the default, apply the default (providing null)
        laneWidthFwd =
          W.model.topCountry.attributes.defaultLaneWidthPerRoadType[
            seg.attributes.roadType
          ] === laneWidthFwd
            ? null
            : laneWidthFwd;
      } else if (laneWidthFwd === null || typeof laneWidthFwd === 'undefined') {
        laneWidthFwd =
          W.model.topCountry.attributes.defaultLaneWidthPerRoadType[seg.attributes.roadType];
      }

      let noChanges = 0;
      if (seg.attributes.fwdDirection) {
        if (numberOfLanes === null) {
          numberOfLanes = seg.attributes.fromLanesInfo?.numberOfLanes ?? 1;
        }
        details.fromLanesInfo = {
          numberOfLanes: numberOfLanes,
          laneWidth: laneWidthFwd,
        };
        if (
          details.fromLanesInfo.numberOfLanes ===
          seg.attributes.fromLanesInfo?.numberOfLanes &&
          details.fromLanesInfo.laneWidth ===
          seg.attributes.fromLanesInfo?.laneWidth
        ) {
          //No changes
          noChanges++;
        }
      }

      if (seg.attributes.revDirection) {
        if (numberOfLanes === null) {
          numberOfLanes = seg.attributes.toLanesInfo?.numberOfLanes ?? 1;
        }
        details.toLanesInfo = {
          numberOfLanes: numberOfLanes,
          laneWidth: laneWidthRev,
        };
        if (
          details.toLanesInfo.numberOfLanes ===
          seg.attributes.toLanesInfo?.numberOfLanes &&
          details.toLanesInfo.laneWidth === seg.attributes.toLanesInfo?.laneWidth
        ) {
          //No changes
          noChanges++;
        }
      }

      //Check if any change was applied
      if (noChanges === 2 || (noChanges === 1 && seg.isOneWay())) {
        return;
      }

      //Apply changes
      try {
        W.model.actionManager.add(new UpdateObject(seg, details));
        //console.log('Details updated');
      } catch (e) {
        console.log('Error! Could not update segment details');
        console.dir(e);
      }
    }

    init();
  }
})();
