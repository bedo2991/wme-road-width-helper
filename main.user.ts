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
    <br>- 1.1.0 Fix: Make the panel <a href="https://update.greasyfork.org/scripts/526924/WME%20Dark%20Mode.user.js" target="_blank">dark-mode</a> friendly.
    <br>- &nbsp;&nbsp;&nbsp;Fix: The inserted lane width is now really applied to the segment.
    <br>- 1.0.1 Fix: 0 allows removing lanes-width information
    <br>- 1.0.0 Start using the new WME SDK
    <br>- 0.4.5 Don't change roadwidth when editing is not enabled`;
    const SCRIPT_ABBREVIATION = 'WRWH';

    let panelDisplayed: (null | boolean) = null;
    //const panelID = Symbol.for("wme_roads_helper");
    const panelDiv = document.createElement('div');
    const INCREASE = '+';
    const DECREASE = '-';
    type AlertLevel = ('warning' | 'error' | 'success' | 'debug' | 'info');
    const safeAlert = (level: AlertLevel, message: string) => {
      try {
        if (level === 'info') {
          WazeWrap.Alerts[level](GM_info.script.name, message, false, false);
        }
        else {
          WazeWrap.Alerts[level](GM_info.script.name, message);
        }
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

    function makeID(name: string): string {
      return `${SCRIPT_ABBREVIATION}_${name}`;
    }

    function displayPanel() {
      if (panelDisplayed === null) {
        //First time
        panelDiv.className = 'panel';
        panelDiv.style.cssText = `position: fixed;
            opacity: 0.9;
            z-index: 100;
            background: var(--background_default);
            width: 220px;
            border-radius: var(--wz-dialog-border-radius, 10px);
            border: 1px solid var(--content_default);
            rgba(0, 0, 0, 0.26) 0px 4px 8px 3px;
            padding: 0px 2px 2px 10px;
            cursor: auto;
            bottom: 10vh;
            color: var(--content_default);
            left: 400px`;
        panelDiv.innerHTML = `<a id="${makeID(
          'close'
        )}" class="close-panel" style="top:10px;right:10px;"></a><h6 title="Version ${GM_info.script.version
          }">${GM_info.script.name.substring(4)}</h6>
            <label for="${makeID(
            'laneWidth'
          )}" title="If empty, it will use the default values set for your country. When set, the script uses the given values for all road types.">Width (in m)</label>
            <input type="number" id="${makeID(
            'laneWidth'
          )}" class="form-control" min="2" max="15" step="0.05" placeholder="WME's default"/><br>
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
          wmeSDK.Map.getLayerZIndex({ layerName: 'Street Vector Layer' });
        }
        catch (ex: any) {
          if (ex.name === "InvalidStateError") {
            // This is the error that we expect, if the layer is not available.
            // In this case, we show the user a message to install the Street Vector Layer script.
            panelDiv.innerHTML +=
              '<div style="color:red;">Street Vector Layer not found. <a href="https://github.com/bedo2991/svl/releases/latest/download/release.user.js" target="_blank">Please consider installing it</a> to see the roads width.</div>';
          }
          else {
            console.error("Error checking for Street Vector Layer");
          }
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

    function toggleApplyDefault(e: Event) {
      const applyDefaultValue = document.getElementById(makeID('apply_default')) as HTMLInputElement;
      if (Number.parseInt((e.target as HTMLInputElement)?.value) > 0) {
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
      const selection = wmeSDK.Editing.getSelection();
      if (!selection || selection?.objectType !== "segment") {
        return safeAlert(
          'warning',
          `You must select at least one segment, first`
        );
      }
      for (var i = 0; i < selection.ids.length; i++) {
        applyLaneWidthToSegment(selection.ids[i] as number, null, increaseOrDecrease);
      }
    }

    function stringToNumber(str: string): number | null {
      const num = Number(str);
      if (!isNaN(num) && !isNaN(parseFloat(str))) {
        return num;
      }
      return null;
    }

    function setLaneWidthOnSelectedSegments(numberOfLanes: number) {
      // If the user can't currently edit (e.g. house numbers editing)
      if (wmeSDK.Editing.isEditingHouseNumbers() || wmeSDK.Editing.isPracticeModeOn() || wmeSDK.Editing.isSnapshotModeOn())
        return;

      if (!isPanelDisplayed()) {
        displayPanel();
      }

      const selection = wmeSDK.Editing.getSelection();
      if (!selection || selection?.objectType !== "segment") {
        return safeAlert(
          'warning',
          `You must select at least one segment, first`
        );
      }

      let userWidthValue: (number | null) = stringToNumber((document
        .getElementById(makeID('laneWidth')) as HTMLInputElement).value);
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
            `Setting ${numberOfLanes} lane${numberOfLanes > 1 ? 's' : ''} on the selected segment${selection.ids.length > 1 ? 's' : ''}.`
          );
        }
      }
      for (let i = 0; i < selection.ids.length; i++) {
        if (numberOfLanes === 0) {
          removeLaneWidthFromSegment(selection.ids[i] as number);
        } else {
          applyLaneWidthToSegment(
            selection.ids[i] as number,
            numberOfLanes > 0 ? numberOfLanes : null,
            userWidthValue
          );
        }
      }
    }

    function removeLaneWidthFromSegment(segmId: number): boolean {
      const segment = wmeSDK.DataModel.Segments.getById({ segmentId: segmId });
      if (!segment) {
        return false;
      }
      const action: any = {
        segmentId: segmId
      };

      if (segment.isAtoB || segment.isTwoWay) {
        action.fromLanesInfo = null;
      }
      if (segment.isBtoA || segment.isTwoWay) {
        action.toLanesInfo = null;
      }

      return performAction(action);
    }

    function performAction(action: any): boolean {
      try {
        wmeSDK.DataModel.Segments.updateSegment(action);
        return true;
      } catch (e) {
        console.log('Error! Could not update segment details. Check that the lanes you are setting are between 2 and 15 meters.');
        console.dir(e);
        safeAlert("error", "Error! Could not update segment details. Check that the lanes you are setting are between 2 and 15 meters.");
        return false;
      }
    }

    function applyLaneWidthToSegment(segId: number, numberOfLanes: (number | null) = null, laneWidthInMeters: (null | number | string) = null): boolean {
      let details: Parameters<typeof wmeSDK.DataModel.Segments.updateSegment>[0] = {
        segmentId: segId,
      };


      let laneWidthFwd = null;
      let laneWidthRev = null;
      const def: any = wmeSDK.DataModel.Countries.getTopCountry()?.defaultLaneWidthPerRoadType;
      if (!def) return false;
      //Check is segment already has a width value
      const segm = wmeSDK.DataModel.Segments.getById({ segmentId: segId });
      console.dir(segm, "SEGMENT");
      if (!segm) return false;
      if (laneWidthInMeters === null) {
        if (segm.isAtoB) {
          laneWidthFwd = segm.fromLanesInfo?.laneWidth;
        }
        else if (segm.isBtoA) {
          laneWidthRev = segm.toLanesInfo?.laneWidth;
        } else {
          laneWidthFwd = segm.fromLanesInfo?.laneWidth;
          laneWidthRev = segm.toLanesInfo?.laneWidth;
        }
      } else if (
        laneWidthInMeters === INCREASE ||
        laneWidthInMeters === DECREASE
      ) {
        if (segm.isAtoB) {
          laneWidthFwd =
            segm.fromLanesInfo?.laneWidth ??
            def[segm.roadType] / 100.0;
        }
        else if (segm.isBtoA) {
          laneWidthRev =
            segm.toLanesInfo?.laneWidth ??
            def[segm.roadType] / 100.0;
        } else {
          laneWidthFwd =
            segm.fromLanesInfo?.laneWidth ??
            def[segm.roadType] / 100.0;
          laneWidthRev =
            segm.toLanesInfo?.laneWidth ??
            def[segm.roadType] / 100.0;
        }
      } else {
        if (typeof laneWidthInMeters === 'string') {
          console.error('Invalid lane width value: ' + laneWidthInMeters);
          return false;
        }
        if (segm.isAtoB) {
          laneWidthFwd = laneWidthInMeters;
        }
        else if (segm.isBtoA) {
          laneWidthRev = laneWidthInMeters;
        } else {
          laneWidthFwd = laneWidthInMeters;
          laneWidthRev = laneWidthInMeters;
        }
      }

      let delta = 0;
      if (laneWidthInMeters === INCREASE) {
        delta = 0.1;
      } else if (laneWidthInMeters === DECREASE) {
        delta = -0.1;
      }

      if (laneWidthInMeters === INCREASE || laneWidthInMeters === DECREASE) {
        if (laneWidthFwd != null) {
          laneWidthFwd += delta;
        }
        if (laneWidthRev != null) {
          laneWidthRev += delta;
        }
      }

      // console.log(`Setting ${numberOfLanes} lanes ${laneWidth} m width.`);
      const applyDefault = (document.getElementById(
        makeID('apply_default')
      ) as HTMLInputElement).checked;
      if (!applyDefault) {
        // if the value I want to apply is the same as the default, apply the default (providing null)
        laneWidthFwd =
          def[
            segm.roadType
          ] / 100.0 === laneWidthFwd
            ? null
            : laneWidthFwd;
      } else if (laneWidthFwd == null) {
        laneWidthFwd =
          def[segm.roadType] / 100.0;
      }

      if (!segm.isAtoB) {
        if (numberOfLanes === null) {
          numberOfLanes = segm.toLanesInfo?.numberOfLanes ?? 1;
        }
        details.toLanesInfo = {
          numberOfLanes: numberOfLanes,
          laneWidth: laneWidthFwd ?? null, // TODO: only use one lane width instead of 2
        };
      }
      if (!segm.isBtoA) {
        if (numberOfLanes === null) {
          numberOfLanes = segm.fromLanesInfo?.numberOfLanes ?? 1;
        }
        details.fromLanesInfo = {
          numberOfLanes: numberOfLanes,
          laneWidth: laneWidthFwd ?? null,
        };
      }

      //Apply changes
      return performAction(details);
    }

    init();
  }
})();
