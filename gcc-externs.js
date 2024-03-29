/* eslint-disable */
/** @fileoverview Define globals that must not be renamed
 *  @externs
 */

const Mousetrap = {
  /**
   *
   * @param {string} keyboardShortcut
   * @param {*} callback
   */
  bind(keyboardShortcut, callback) {},
};
/**
 *
 * @param {string} path
 */
function require(path) {}
const Restriction = class {
  constructor() {}
  /**
   * @return {string}
   */
  getDefaultType() {}
};

/**
 * @typedef {{
 * id:number,
 * roadType:number,
 * routingRoadType:(number|null),
 * virtualNodeIDs:Array.<number>,
 * separator:boolean,
 * lockRank:number,
 * validated:boolean,
 * createdBy:number,
 * createdOn:number,
 * updatedBy:number,
 * updatedOn:number,
 * fwdDirection:boolean,
 * revDirection:boolean,
 * fromNodeID:number,
 * toNodeID:number,
 * primaryStreetID:(number|null),
 * geometry:OpenLayers.Geometry.LineString,
 * fwdMaxSpeed:number,
 * revMaxSpeed:number,
 * fwdMaxSpeedUnverified:boolean,
 * revMaxSpeedUnverified:boolean,
 * streetIDs:Array.<number>,
 * junctionID:(number|null),
 * hasHNs:boolean,
 * hasClosures:boolean,
 * length:number,
 * fwdToll:boolean,
 * revToll:boolean,
 * restrictions:Array.<Restriction>,
 * parkingRestrictions:Array,
 * pickupRestrictions:Array,
 * permissions:number,
 * crossroadID:(number|null),
 * fromCrossroads:Array.<number>,
 * toCrossroads:Array.<number>,
 * allowNoDirection:boolean,
 * fwdTurnsLocked:boolean,
 * revTurnsLocked:boolean,
 * flags:number,
 * fwdFlags:number,
 * revFlags:number,
 * level:number,
 * rank:number,
 * fwdLaneCount:number,
 * revLaneCount:number,
 * width:(number|undefined),
 * fromLanesInfo:LaneWidthInfos,
 * toLanesInfo:LaneWidthInfos
 * }}
 */
let SegmentAttributes;

/**
 * @typedef {{
 * laneWidth:(number|null),
 * numberOfLanes:number
 * }}
 */
let LaneWidthInfos;

/**
 * @typedef {{
 * id:number,
 * geometry:OpenLayers.Geometry.Point,
 * permissions:number,
 * rank:(number|null) ,
 * segIDs:Array.<number>,
 * partial:boolean
 * }}
 */
let NodeAttributes;

/**
 * @typedef {{
 * strokeColor:(string|undefined),
 * strokeWidth:(string|undefined),
 * strokeOpacity:(string|undefined),
 * strokeDashstyle:(string|undefined),
 * graphicZIndex:(string|undefined),
 * fontFamily:(string|undefined),
 * fontWeight:(string|undefined),
 * fontColor:(string|undefined),
 * labelOutlineColor:(string|undefined),
 * labelOutlineWidth:(string|undefined),
 * label:(string|undefined),
 * angle:(string|undefined),
 * pointerEvents:(string|undefined),
 * visibility:(boolean|undefined),
 * }}
 */
let StyleMapContent;

/**
 * @typedef {{
 * id:number,
 * cityID:(number|null),
 * englishName:(string|null),
 * name:(string|null),
 * isEmpty:boolean,
 * outOfScope:boolean,
 * persistent:boolean,
 * selected:boolean,
 * signText:(string|null),
 * signType:(string|null),
 * state:(number|null),
 * }}
 */
let StreetAttributes;

/**
 * @typedef {{
 * state:Object,
 * street:StreetAttributes,
 * }}
 */

let AddressAttributes;

/**
 * @typedef {{
 * attributes:AddressAttributes,
 * }}
 */
let AddressObject;

/**
 * @typedef {{
 * tunnel:boolean,
 * unpaved:boolean,
 * headlights:boolean,
 * beacons:boolean,
 * nearbyHOV:boolean,
 * fwdSpeedCamera:boolean,
 * revSpeedCamera:boolean,
 * fwdLanesEnabled:boolean,
 * revLanesEnabled:boolean
 * }}
 */
let FlagAttributes;

const W = {
  'selectionManager': {
    /**
     * @returns {Array<*>}
     */
    'getSelectedFeatures': function () {},
    /**
     * @returns {{segments:Array<Waze.DataModel>}}
     */
    'getSegmentSelection': function () {},
  },
  'editingMediator':{
    'attributes':{
      /**@type{boolean} */
      'editingEnabled':true
    }
  },
  'controller': {
    'reload': function () {},
  },
  'map': {
    /**
     * @return {OpenLayers.Map}
     */
    'getOLMap': function () {},
    /**
     *
     * @param {string} uniqueName
     * @return {OpenLayers.Layer.Vector}
     * @deprecated
     */
    'getLayerByUniqueName': function (uniqueName) {},
    /**
     *
     * @param {string} uniqueName
     * @return {OpenLayers.Layer.Vector|undefined}
     */
    'getLayerByName': function (uniqueName) {},
  },
  'model': {
    'events': {
      /**
       *
       * @param {string} event_name
       * @param {(*|null)} context
       * @param {Function} callback
       */
      'register': function (event_name, context, callback) {},
      /**
       *
       * @param {string} event_name
       * @param {(*|null)} context
       * @param {Function} callback
       */
      'unregister': function (event_name, context, callback) {},
    },
    'actionManager': {
      /**
       * @return {number}
       */
      'unsavedActionsNum': function () {},
      /**
       *
       * @param {*} action
       */
      'add': function (action) {},
    },
    'topCountry': {
      'attributes':{
      /**@type{string} */
      'abbr': '',
      /**@type{string} */
      'env': '',
      /**@type{number} */
      'id': 0,
      /** @type{Object.<string, number>} */
      'defaultLaneWidthPerRoadType': {}
      }
    },
    'streets': {
      /** @type{Object.<number, StreetAttributes>} */
      'objects': {},
      '_events': {
        'objectsupdated': [],
      },
    },
    'segments': {
      'objects': {},
      '_events': {
        'objectsadded': [],
        'objectschanged': [],
        'objectsremoved': [],
        'objects-state-deleted': [],
      },
    },
    'nodes': {
      'objects': {},
      '_events': {
        'objectsadded': [],
        'objectschanged': [],
        'objectsremoved': [],
        'objects-state-deleted': [],
      },
    },
  },
  'prefs': {
    '_events': {},
    'attributes': {
      /**@type {boolean} */
      'isImperial': true,
    },
  },
};

const I18n = {
  'translations': {},
  /** @type {string} */
  'locale': '',
  /**
   * @returns {string}
   */
  currentLocale: function () {},
};
const GM_info = {
  'script': {
    /** @type {string} */
    'version': '',
    /** @type {string} */
    'supportURL': '',
    /** @type {string} */
    'name': '',
  },
};

/**
 * @typedef {Object} OpenLayers
 */
const OpenLayers = {
  'Bounds': class {
    constructor() {}

    /**
     *
     * @param {OpenLayers.Bounds} extend
     * @return {boolean}
     */
    intersectsBounds(extend) {}
  },
  'Projection': class {
    /**
     *
     * @param {string} projCode
     * @param {Object=} object
     */
    constructor(projCode, object) {
      this.proj;
      /**@type{string} */
      this.projCode = projCode;
      this.titleRegEx;
    }
  },
  'LonLat': class {
    /**
     *
     * @param {number} lon
     * @param {number} lat
     */
    constructor(lon, lat) {}

    /**
     *
     * @param {number} lon
     * @param {number} lat
     * @return {OpenLayers.LonLat}
     */
    add(lon, lat) {}

    /**
     *
     * @param {OpenLayers.Projection} source
     * @param {OpenLayers.Projection} dest
     * @return {OpenLayers.LonLat}
     */
    transform(source, dest) {}
  },
  'Pixel': class {
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y) {}
  },
  'Size': class {
    constructor() {
      /** @type {number} */
      this.w;
      /** @type {number} */
      this.h;
    }
  },
  'Map': class {
    constructor() {
      /** @type {number} */
      this.zoom;
      /** @type {number} */
      this.resolution;
      /** @type {OpenLayers.Projection} */
      this.projection;
      this.events = {
        /**
         *
         * @param {string} eventName
         * @param {*} a
         * @param {Function} callback
         * @param {boolean} [priority=false]
         */
        'register': function (eventName, a, callback, priority) {},
      };
    }

    /**
     * @return {OpenLayers.LonLat}
     */
    getCachedCenter() {}

    /**
     *
     * @param {OpenLayers.Layer.Vector} layer
     */
    addLayer(layer) {}

    /**
     *
     * @param {string} attr
     * @param {string} value
     * @return {Array.<OpenLayers.Layer.Vector>}
     */
    getLayersBy(attr, value) {}

    /**
     * @param {OpenLayers.Pixel=} pixel
     * @return {OpenLayers.Size}
     */
    getGeodesicPixelSize(pixel) {}
  },
  'StyleMap': class {
    /**
     *
     * @param {StyleMapContent} style
     */
    constructor(style) {}
  },
  /** @typedef {Object} Geometry */
  'Geometry': {
    'Point': class Point {
      /**
       *
       * @param {number} x
       * @param {number} y
       */
      constructor(x, y) {
        /** @type {number} */
        this.x;
        /** @type {number} */
        this.y;
      }

      /**
       *
       * @param {OpenLayers.Geometry.Point} point
       * @return {number}
       */
      distanceTo(point) {}
    },
    'LineString': class LineString {
      constructor(pointArray) {
        /** @type {Array.<OpenLayers.Geometry.Point>} */
        this.components;
      }
      /**@return Array */
      getVertices() {}
      /**
       *
       * @param {boolean} a
       */
      getCentroid(a) {}

      /**
       *
       * @param {number} factor
       * @return {OpenLayers.Geometry.LineString}
       */
      simplify(factor) {}
    },

    /**
     * @return {OpenLayers.Bounds}
     */
    'getBounds': function () {},
  },
  /** @typedef Renderer */
  'Renderer': class {
    constructor() {
      /** @type {number} */
      this.featureDx;
      this.textRoot;
      this.left;
      //* * @type {OpenLayers.Bounds} */
      this.extent;
      this.top;
      /** @type {string} */
      this.LABEL_ID_SUFFIX;
      /** @type {string} */
      this.LABEL_OUTLINE_SUFFIX;
    }

    /**
     *
     * @param {number} id
     */
    removeText(id) {}

    /** @returns {number} */
    getResolution() {}

    drawFeature(feature, style) {}

    drawText(id, style, location) {}

    drawGeometry(geometry, style, id) {}

    /**
     *
     * @param {string} id
     * @param {string} type
     */
    nodeFactory(id, type) {}
  },
  /** @type {boolean} */
  'IS_GECKO': true,
  'Util': {
    'extend': function (a, b) {},
    'distVincenty': function (a, b) {},
  },
  /** @typedef Feature
   */
  'Feature': {
    'Vector': class {
      /**
       *
       * @param {OpenLayers.Geometry.Point | OpenLayers.Geometry.LineString} geometry
       * @param {Object} attributes
       * @param {Object=} style
       */
      constructor(geometry, attributes, style) {
        /** @type {OpenLayers.Geometry.Point | OpenLayers.Geometry.LineString} */
        this.geometry;
        this.attributes;
        /** @type{Waze.Feature.Vector.Segment|Waze.Feature.Vector.Node} */
        this.model;
        this.style;
      }

      /** @return {OpenLayers.Feature.Vector} */
      clone() {}
      /**
       *
       * @param {OpenLayers.LonLat|OpenLayers.Pixel} lonLat
       */
      move(lonLat) {}
    },
  },
  /** @typedef Layer
   *
   */
  'Layer': {
    /**
     * @unrestricted
     */
    'Vector': class {
      /**
       *
       * @param {string} name
       * @param {Object} properties
       */
      constructor(name, properties) {
        this.events = {
          /**
           *
           * @param {string} eventName
           * @param {*} a
           * @param {Function} callback
           * @param {boolean} [priority=false]
           */
          'register': function (eventName, a, callback, priority) {},
        };
        /** @type {OpenLayers.Renderer} */
        this.renderer;
        /** @type {boolean} */
        this.visibility = true;
        /** @type {Array.<OpenLayers.Feature.Vector>} */
        this.features;
      }

      /**
       * @return {number}
       */
      getZIndex() {}

      /**
       *
       * @param {number} opacity
       */
      setOpacity(opacity) {}

      /**
       *
       * @param {boolean} bool
       */
      setVisibility(bool) {}

      /**
       *
       * @return {boolean}
       */
      getVisibility() {}

      /**
       *
       * @param {number} value
       */
      setZIndex(value) {}

      /**
       *
       * @param {Array.<OpenLayers.Feature.Vector>=} array
       * @param {Object=} options
       */
      destroyFeatures(array, options) {}

      /**
       *
       * @param {string} featureName
       * @param {*} id
       * @return {Array.<OpenLayers.Feature.Vector>}
       */
      getFeaturesByAttribute(featureName, id) {}

      /**
       *
       * @param {Array.<OpenLayers.Feature.Vector>} features
       * @param {Object=} options
       */
      addFeatures(features, options) {}
    },
  },
};
// Static properties
OpenLayers.Renderer.symbol = {};
OpenLayers.Renderer.defaultSymbolizer = {
  /** @type {string} */
  'labelAlign': '',
};

OpenLayers.Renderer.SVG = class SVG {
  constructor() {}
};

// Static properties
OpenLayers.Renderer.SVG.LABEL_VSHIFT = [];
OpenLayers.Renderer.SVG.LABEL_ALIGN = [];
OpenLayers.Renderer.SVG.LABEL_VFACTOR = [];

const WazeWrap = {
  'User': {
    /** @return {number} */
    'Rank': function () {},
  },
  'Alerts': {
    /**
     *
     * @param {string} name
     * @param {string} message
     */
    'info': function (name, message) {},
    /**
     *
     * @param {string} name
     * @param {string} message
     */
    'warning': function (name, message) {},
    /**
     *
     * @param {string} name
     * @param {string} message
     */
    'error': function (name, message) {},
    /**
     *
     * @param {string} name
     * @param {string} message
     */
    'success': function (name, message) {},
    /**
     *
     * @param {string} name
     * @param {string} message
     */
    'debug': function (name, message) {},
    /**
     *
     * @param {string} name
     * @param {string} message
     * @param {?string} defaultText
     * @param {Function} okCallback
     * @param {Function} cancelCalback
     */
    'prompt': function (
      name,
      message,
      defaultText,
      okCallback,
      cancelCalback
    ) {},
    /**
     *
     * @param {string} name
     * @param {string} message
     * @param {Function} okCallback
     * @param {Function} cancelCalback
     * @param {?string} [okButtonText="Ok"]
     * @param {?string} [cancelButtonText="Cancel"]
     */
    'confirm': function (
      name,
      message,
      okCallback,
      cancelCalback,
      okButtonText,
      cancelButtonText
    ) {},
  },
  /** @type {boolean} */
  'Ready': true,
  /**
   * @return {boolean}
   */
  'hasSelectedFeatures': function () {},
  'Interface': {
    'Tab': class {
      /**
       * Creates a tab in the side panel
       * @function WazeWrap.Interface.Tab
       * @param {string} name
       * @param {string} content
       * @param {Function} callback
       * @param {Object=} context
       * */
      constructor(name, content, callback, context) {}
    },
    'Shortcut': class {
      /**
       * Creates a keyboard shortcut for the supplied callback event
       * @function WazeWrap.Interface.Shortcut
       * @param {string} name
       * @param {string} desc
       * @param {string} group
       * @param {string} title
       * @param {string} shortcut
       * @param {Function} callback
       * @param {Object=} scope
       * @return {OpenLayers.Geometry.Point} A point at the general location of the segment, null if the segment is not found
       * */
      constructor(name, desc, group, title, shortcut, callback, scope) {}

      add() {}
    },
    /**
     *
     * @param {string} name
     * @param {string} version
     * @param {string} html
     * @param {string} greasemonkeyURL
     * @param {string} forumURL
     */
    'ShowScriptUpdate': function (
      name,
      version,
      html,
      greasemonkeyURL,
      forumURL
    ) {},

    /**
     * Creates a checkbox in the layer menu
     * @function WazeWrap.Interface.AddLayerCheckbox
     * @param {string} group
     * @param {string} checkboxText
     * @param {boolean} checked
     * @param {Function} callback
     * @param {Object} layer
     * */
    'AddLayerCheckbox': function (
      group,
      checkboxText,
      checked,
      callback,
      layer
    ) {},
  },
};
const jQueryObject = class jQueryObject {
  constructor() {}
  /**
   *
   * @param {string} a
   * @param {boolean|string} b
   */
  prop(a, b) {}
  /**
   *
   * @param {Function} callback
   */
  click(callback) {}
};

/**
 * @param {string} x
 * @return {jQueryObject}
 */
const $ = function (x) {};
/**
 *
 * @param {string} x
 */
const GM_setClipboard = function (x) {};

/** @typedef {Object} Waze */
const Waze = {
  'DataModel': class {
    constructor() {}
  },
  /** @typedef {Object} Feature */
  'Feature': {
    /** @typedef {Object} Vector */
    'Vector': {
      'Segment': class {
        constructor() {
          /** @type{Waze.DataModel} */
          this.model;
          /** @type {SegmentAttributes} */
          this.attributes;
          /** @type {string} */
          this.state;
        }

        /** @return {SegmentAttributes} */
        getAttributes() {}

        /** @return {boolean} */
        isOneWay() {}

        /** @return {boolean} */
        isInRoundabout() {}

        /** @return {number} - from 0 to 6. */
        getLockRank() {}

        /** @return {FlagAttributes} */
        getFlagAttributes() {}

        /** @return {AddressObject} */
        getAddress() {}

        /** @return {boolean} */
        hasNonEmptyStreet() {}
        /**
         * @return {number}
         */
        getID() {}

        /**
         * @return {?number}
         */
        getOldID() {}
      },
      'Node': class {
        constructor() {
          /** @type {NodeAttributes} */
          this.attributes;
        }

        /** @return {NodeAttributes} */
        getAttributes() {}

        /** @return {boolean} */
        isOneWay() {}

        /** @return {boolean} */
        isInRoundabout() {}

        /** @return {number} - from 0 to 6. */
        getLockRank() {}

        /** @return {FlagAttributes} */
        getFlagAttributes() {}

        /**
         * @return {number}
         */
        getID() {}
      },
    },
  },
};
