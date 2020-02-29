// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/rot-js/lib/rng.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
const FRAC = 2.3283064365386963e-10;
/* 2^-32 */

class RNG {
  constructor() {
    this._seed = 0;
    this._s0 = 0;
    this._s1 = 0;
    this._s2 = 0;
    this._c = 0;
  }

  getSeed() {
    return this._seed;
  }
  /**
   * Seed the number generator
   */


  setSeed(seed) {
    seed = seed < 1 ? 1 / seed : seed;
    this._seed = seed;
    this._s0 = (seed >>> 0) * FRAC;
    seed = seed * 69069 + 1 >>> 0;
    this._s1 = seed * FRAC;
    seed = seed * 69069 + 1 >>> 0;
    this._s2 = seed * FRAC;
    this._c = 1;
    return this;
  }
  /**
   * @returns Pseudorandom value [0,1), uniformly distributed
   */


  getUniform() {
    let t = 2091639 * this._s0 + this._c * FRAC;
    this._s0 = this._s1;
    this._s1 = this._s2;
    this._c = t | 0;
    this._s2 = t - this._c;
    return this._s2;
  }
  /**
   * @param lowerBound The lower end of the range to return a value from, inclusive
   * @param upperBound The upper end of the range to return a value from, inclusive
   * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
   */


  getUniformInt(lowerBound, upperBound) {
    let max = Math.max(lowerBound, upperBound);
    let min = Math.min(lowerBound, upperBound);
    return Math.floor(this.getUniform() * (max - min + 1)) + min;
  }
  /**
   * @param mean Mean value
   * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
   * @returns A normally distributed pseudorandom value
   */


  getNormal(mean = 0, stddev = 1) {
    let u, v, r;

    do {
      u = 2 * this.getUniform() - 1;
      v = 2 * this.getUniform() - 1;
      r = u * u + v * v;
    } while (r > 1 || r == 0);

    let gauss = u * Math.sqrt(-2 * Math.log(r) / r);
    return mean + gauss * stddev;
  }
  /**
   * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
   */


  getPercentage() {
    return 1 + Math.floor(this.getUniform() * 100);
  }
  /**
   * @returns Randomly picked item, null when length=0
   */


  getItem(array) {
    if (!array.length) {
      return null;
    }

    return array[Math.floor(this.getUniform() * array.length)];
  }
  /**
   * @returns New array with randomized items
   */


  shuffle(array) {
    let result = [];
    let clone = array.slice();

    while (clone.length) {
      let index = clone.indexOf(this.getItem(clone));
      result.push(clone.splice(index, 1)[0]);
    }

    return result;
  }
  /**
   * @param data key=whatever, value=weight (relative probability)
   * @returns whatever
   */


  getWeightedValue(data) {
    let total = 0;

    for (let id in data) {
      total += data[id];
    }

    let random = this.getUniform() * total;
    let id,
        part = 0;

    for (id in data) {
      part += data[id];

      if (random < part) {
        return id;
      }
    } // If by some floating-point annoyance we have
    // random >= total, just return the last id.


    return id;
  }
  /**
   * Get RNG state. Useful for storing the state and re-setting it via setState.
   * @returns Internal state
   */


  getState() {
    return [this._s0, this._s1, this._s2, this._c];
  }
  /**
   * Set a previously retrieved state.
   */


  setState(state) {
    this._s0 = state[0];
    this._s1 = state[1];
    this._s2 = state[2];
    this._c = state[3];
    return this;
  }
  /**
   * Returns a cloned RNG
   */


  clone() {
    let clone = new RNG();
    return clone.setState(this.getState());
  }

}

var _default = new RNG().setSeed(Date.now());

exports.default = _default;
},{}],"../node_modules/rot-js/lib/display/backend.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @class Abstract display backend module
 * @private
 */
class Backend {
  getContainer() {
    return null;
  }

  setOptions(options) {
    this._options = options;
  }

}

exports.default = Backend;
},{}],"../node_modules/rot-js/lib/display/canvas.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _backend = _interopRequireDefault(require("./backend.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Canvas extends _backend.default {
  constructor() {
    super();
    this._ctx = document.createElement("canvas").getContext("2d");
  }

  schedule(cb) {
    requestAnimationFrame(cb);
  }

  getContainer() {
    return this._ctx.canvas;
  }

  setOptions(opts) {
    super.setOptions(opts);
    const style = opts.fontStyle ? `${opts.fontStyle} ` : ``;
    const font = `${style} ${opts.fontSize}px ${opts.fontFamily}`;
    this._ctx.font = font;

    this._updateSize();

    this._ctx.font = font;
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";
  }

  clear() {
    this._ctx.fillStyle = this._options.bg;

    this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
  }

  eventToPosition(x, y) {
    let canvas = this._ctx.canvas;
    let rect = canvas.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
    x *= canvas.width / rect.width;
    y *= canvas.height / rect.height;

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
      return [-1, -1];
    }

    return this._normalizedEventToPosition(x, y);
  }

}

exports.default = Canvas;
},{"./backend.js":"../node_modules/rot-js/lib/display/backend.js"}],"../node_modules/rot-js/lib/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mod = mod;
exports.clamp = clamp;
exports.capitalize = capitalize;
exports.format = format;

/**
 * Always positive modulus
 * @param x Operand
 * @param n Modulus
 * @returns x modulo n
 */
function mod(x, n) {
  return (x % n + n) % n;
}

function clamp(val, min = 0, max = 1) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
}
/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */


function format(template, ...args) {
  let map = format.map;

  let replacer = function (match, group1, group2, index) {
    if (template.charAt(index - 1) == "%") {
      return match.substring(1);
    }

    if (!args.length) {
      return match;
    }

    let obj = args[0];
    let group = group1 || group2;
    let parts = group.split(",");
    let name = parts.shift() || "";
    let method = map[name.toLowerCase()];

    if (!method) {
      return match;
    }

    obj = args.shift();
    let replaced = obj[method].apply(obj, parts);
    let first = name.charAt(0);

    if (first != first.toLowerCase()) {
      replaced = capitalize(replaced);
    }

    return replaced;
  };

  return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}

format.map = {
  "s": "toString"
};
},{}],"../node_modules/rot-js/lib/display/hex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _canvas = _interopRequireDefault(require("./canvas.js"));

var _util = require("../util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Hexagonal backend
 * @private
 */
class Hex extends _canvas.default {
  constructor() {
    super();
    this._spacingX = 0;
    this._spacingY = 0;
    this._hexSize = 0;
  }

  draw(data, clearBefore) {
    let [x, y, ch, fg, bg] = data;
    let px = [(x + 1) * this._spacingX, y * this._spacingY + this._hexSize];

    if (this._options.transpose) {
      px.reverse();
    }

    if (clearBefore) {
      this._ctx.fillStyle = bg;

      this._fill(px[0], px[1]);
    }

    if (!ch) {
      return;
    }

    this._ctx.fillStyle = fg;
    let chars = [].concat(ch);

    for (let i = 0; i < chars.length; i++) {
      this._ctx.fillText(chars[i], px[0], Math.ceil(px[1]));
    }
  }

  computeSize(availWidth, availHeight) {
    if (this._options.transpose) {
      availWidth += availHeight;
      availHeight = availWidth - availHeight;
      availWidth -= availHeight;
    }

    let width = Math.floor(availWidth / this._spacingX) - 1;
    let height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
    return [width, height];
  }

  computeFontSize(availWidth, availHeight) {
    if (this._options.transpose) {
      availWidth += availHeight;
      availHeight = availWidth - availHeight;
      availWidth -= availHeight;
    }

    let hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
    let hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
    let hexSize = Math.min(hexSizeWidth, hexSizeHeight); // compute char ratio

    let oldFont = this._ctx.font;
    this._ctx.font = "100px " + this._options.fontFamily;
    let width = Math.ceil(this._ctx.measureText("W").width);
    this._ctx.font = oldFont;
    let ratio = width / 100;
    hexSize = Math.floor(hexSize) + 1; // closest larger hexSize
    // FIXME char size computation does not respect transposed hexes

    let fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3))); // closest smaller fontSize

    return Math.ceil(fontSize) - 1;
  }

  _normalizedEventToPosition(x, y) {
    let nodeSize;

    if (this._options.transpose) {
      x += y;
      y = x - y;
      x -= y;
      nodeSize = this._ctx.canvas.width;
    } else {
      nodeSize = this._ctx.canvas.height;
    }

    let size = nodeSize / this._options.height;
    y = Math.floor(y / size);

    if ((0, _util.mod)(y, 2)) {
      /* odd row */
      x -= this._spacingX;
      x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
    } else {
      x = 2 * Math.floor(x / (2 * this._spacingX));
    }

    return [x, y];
  }
  /**
   * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
   */


  _fill(cx, cy) {
    let a = this._hexSize;
    let b = this._options.border;
    const ctx = this._ctx;
    ctx.beginPath();

    if (this._options.transpose) {
      ctx.moveTo(cx - a + b, cy);
      ctx.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
      ctx.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
      ctx.lineTo(cx + a - b, cy);
      ctx.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
      ctx.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
      ctx.lineTo(cx - a + b, cy);
    } else {
      ctx.moveTo(cx, cy - a + b);
      ctx.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
      ctx.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
      ctx.lineTo(cx, cy + a - b);
      ctx.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
      ctx.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
      ctx.lineTo(cx, cy - a + b);
    }

    ctx.fill();
  }

  _updateSize() {
    const opts = this._options;
    const charWidth = Math.ceil(this._ctx.measureText("W").width);
    this._hexSize = Math.floor(opts.spacing * (opts.fontSize + charWidth / Math.sqrt(3)) / 2);
    this._spacingX = this._hexSize * Math.sqrt(3) / 2;
    this._spacingY = this._hexSize * 1.5;
    let xprop;
    let yprop;

    if (opts.transpose) {
      xprop = "height";
      yprop = "width";
    } else {
      xprop = "width";
      yprop = "height";
    }

    this._ctx.canvas[xprop] = Math.ceil((opts.width + 1) * this._spacingX);
    this._ctx.canvas[yprop] = Math.ceil((opts.height - 1) * this._spacingY + 2 * this._hexSize);
  }

}

exports.default = Hex;
},{"./canvas.js":"../node_modules/rot-js/lib/display/canvas.js","../util.js":"../node_modules/rot-js/lib/util.js"}],"../node_modules/rot-js/lib/display/rect.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _canvas = _interopRequireDefault(require("./canvas.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Rectangular backend
 * @private
 */
class Rect extends _canvas.default {
  constructor() {
    super();
    this._spacingX = 0;
    this._spacingY = 0;
    this._canvasCache = {};
  }

  setOptions(options) {
    super.setOptions(options);
    this._canvasCache = {};
  }

  draw(data, clearBefore) {
    if (Rect.cache) {
      this._drawWithCache(data);
    } else {
      this._drawNoCache(data, clearBefore);
    }
  }

  _drawWithCache(data) {
    let [x, y, ch, fg, bg] = data;
    let hash = "" + ch + fg + bg;
    let canvas;

    if (hash in this._canvasCache) {
      canvas = this._canvasCache[hash];
    } else {
      let b = this._options.border;
      canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      canvas.width = this._spacingX;
      canvas.height = this._spacingY;
      ctx.fillStyle = bg;
      ctx.fillRect(b, b, canvas.width - b, canvas.height - b);

      if (ch) {
        ctx.fillStyle = fg;
        ctx.font = this._ctx.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let chars = [].concat(ch);

        for (let i = 0; i < chars.length; i++) {
          ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
        }
      }

      this._canvasCache[hash] = canvas;
    }

    this._ctx.drawImage(canvas, x * this._spacingX, y * this._spacingY);
  }

  _drawNoCache(data, clearBefore) {
    let [x, y, ch, fg, bg] = data;

    if (clearBefore) {
      let b = this._options.border;
      this._ctx.fillStyle = bg;

      this._ctx.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
    }

    if (!ch) {
      return;
    }

    this._ctx.fillStyle = fg;
    let chars = [].concat(ch);

    for (let i = 0; i < chars.length; i++) {
      this._ctx.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
    }
  }

  computeSize(availWidth, availHeight) {
    let width = Math.floor(availWidth / this._spacingX);
    let height = Math.floor(availHeight / this._spacingY);
    return [width, height];
  }

  computeFontSize(availWidth, availHeight) {
    let boxWidth = Math.floor(availWidth / this._options.width);
    let boxHeight = Math.floor(availHeight / this._options.height);
    /* compute char ratio */

    let oldFont = this._ctx.font;
    this._ctx.font = "100px " + this._options.fontFamily;
    let width = Math.ceil(this._ctx.measureText("W").width);
    this._ctx.font = oldFont;
    let ratio = width / 100;
    let widthFraction = ratio * boxHeight / boxWidth;

    if (widthFraction > 1) {
      /* too wide with current aspect ratio */
      boxHeight = Math.floor(boxHeight / widthFraction);
    }

    return Math.floor(boxHeight / this._options.spacing);
  }

  _normalizedEventToPosition(x, y) {
    return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
  }

  _updateSize() {
    const opts = this._options;
    const charWidth = Math.ceil(this._ctx.measureText("W").width);
    this._spacingX = Math.ceil(opts.spacing * charWidth);
    this._spacingY = Math.ceil(opts.spacing * opts.fontSize);

    if (opts.forceSquareRatio) {
      this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
    }

    this._ctx.canvas.width = opts.width * this._spacingX;
    this._ctx.canvas.height = opts.height * this._spacingY;
  }

}

exports.default = Rect;
Rect.cache = false;
},{"./canvas.js":"../node_modules/rot-js/lib/display/canvas.js"}],"../node_modules/rot-js/lib/display/tile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _canvas = _interopRequireDefault(require("./canvas.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Tile backend
 * @private
 */
class Tile extends _canvas.default {
  constructor() {
    super();
    this._colorCanvas = document.createElement("canvas");
  }

  draw(data, clearBefore) {
    let [x, y, ch, fg, bg] = data;
    let tileWidth = this._options.tileWidth;
    let tileHeight = this._options.tileHeight;

    if (clearBefore) {
      if (this._options.tileColorize) {
        this._ctx.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
      } else {
        this._ctx.fillStyle = bg;

        this._ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
      }
    }

    if (!ch) {
      return;
    }

    let chars = [].concat(ch);
    let fgs = [].concat(fg);
    let bgs = [].concat(bg);

    for (let i = 0; i < chars.length; i++) {
      let tile = this._options.tileMap[chars[i]];

      if (!tile) {
        throw new Error(`Char "${chars[i]}" not found in tileMap`);
      }

      if (this._options.tileColorize) {
        // apply colorization
        let canvas = this._colorCanvas;
        let context = canvas.getContext("2d");
        context.globalCompositeOperation = "source-over";
        context.clearRect(0, 0, tileWidth, tileHeight);
        let fg = fgs[i];
        let bg = bgs[i];
        context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

        if (fg != "transparent") {
          context.fillStyle = fg;
          context.globalCompositeOperation = "source-atop";
          context.fillRect(0, 0, tileWidth, tileHeight);
        }

        if (bg != "transparent") {
          context.fillStyle = bg;
          context.globalCompositeOperation = "destination-over";
          context.fillRect(0, 0, tileWidth, tileHeight);
        }

        this._ctx.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
      } else {
        // no colorizing, easy
        this._ctx.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
      }
    }
  }

  computeSize(availWidth, availHeight) {
    let width = Math.floor(availWidth / this._options.tileWidth);
    let height = Math.floor(availHeight / this._options.tileHeight);
    return [width, height];
  }

  computeFontSize() {
    throw new Error("Tile backend does not understand font size");
  }

  _normalizedEventToPosition(x, y) {
    return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
  }

  _updateSize() {
    const opts = this._options;
    this._ctx.canvas.width = opts.width * opts.tileWidth;
    this._ctx.canvas.height = opts.height * opts.tileHeight;
    this._colorCanvas.width = opts.tileWidth;
    this._colorCanvas.height = opts.tileHeight;
  }

}

exports.default = Tile;
},{"./canvas.js":"../node_modules/rot-js/lib/display/canvas.js"}],"../node_modules/rot-js/lib/color.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromString = fromString;
exports.add = add;
exports.add_ = add_;
exports.multiply = multiply;
exports.multiply_ = multiply_;
exports.interpolate = interpolate;
exports.interpolateHSL = interpolateHSL;
exports.randomize = randomize;
exports.rgb2hsl = rgb2hsl;
exports.hsl2rgb = hsl2rgb;
exports.toRGB = toRGB;
exports.toHex = toHex;
exports.lerpHSL = exports.lerp = void 0;

var _util = require("./util.js");

var _rng = _interopRequireDefault(require("./rng.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fromString(str) {
  let cached, r;

  if (str in CACHE) {
    cached = CACHE[str];
  } else {
    if (str.charAt(0) == "#") {
      // hex rgb
      let matched = str.match(/[0-9a-f]/gi) || [];
      let values = matched.map(x => parseInt(x, 16));

      if (values.length == 3) {
        cached = values.map(x => x * 17);
      } else {
        for (let i = 0; i < 3; i++) {
          values[i + 1] += 16 * values[i];
          values.splice(i, 1);
        }

        cached = values;
      }
    } else if (r = str.match(/rgb\(([0-9, ]+)\)/i)) {
      // decimal rgb
      cached = r[1].split(/\s*,\s*/).map(x => parseInt(x));
    } else {
      // html name
      cached = [0, 0, 0];
    }

    CACHE[str] = cached;
  }

  return cached.slice();
}
/**
 * Add two or more colors
 */


function add(color1, ...colors) {
  let result = color1.slice();

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < colors.length; j++) {
      result[i] += colors[j][i];
    }
  }

  return result;
}
/**
 * Add two or more colors, MODIFIES FIRST ARGUMENT
 */


function add_(color1, ...colors) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < colors.length; j++) {
      color1[i] += colors[j][i];
    }
  }

  return color1;
}
/**
 * Multiply (mix) two or more colors
 */


function multiply(color1, ...colors) {
  let result = color1.slice();

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < colors.length; j++) {
      result[i] *= colors[j][i] / 255;
    }

    result[i] = Math.round(result[i]);
  }

  return result;
}
/**
 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
 */


function multiply_(color1, ...colors) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < colors.length; j++) {
      color1[i] *= colors[j][i] / 255;
    }

    color1[i] = Math.round(color1[i]);
  }

  return color1;
}
/**
 * Interpolate (blend) two colors with a given factor
 */


function interpolate(color1, color2, factor = 0.5) {
  let result = color1.slice();

  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }

  return result;
}

const lerp = interpolate;
/**
 * Interpolate (blend) two colors with a given factor in HSL mode
 */

exports.lerp = lerp;

function interpolateHSL(color1, color2, factor = 0.5) {
  let hsl1 = rgb2hsl(color1);
  let hsl2 = rgb2hsl(color2);

  for (let i = 0; i < 3; i++) {
    hsl1[i] += factor * (hsl2[i] - hsl1[i]);
  }

  return hsl2rgb(hsl1);
}

const lerpHSL = interpolateHSL;
/**
 * Create a new random color based on this one
 * @param color
 * @param diff Set of standard deviations
 */

exports.lerpHSL = lerpHSL;

function randomize(color, diff) {
  if (!(diff instanceof Array)) {
    diff = Math.round(_rng.default.getNormal(0, diff));
  }

  let result = color.slice();

  for (let i = 0; i < 3; i++) {
    result[i] += diff instanceof Array ? Math.round(_rng.default.getNormal(0, diff[i])) : diff;
  }

  return result;
}
/**
 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
 */


function rgb2hsl(color) {
  let r = color[0] / 255;
  let g = color[1] / 255;
  let b = color[2] / 255;
  let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
  let h = 0,
      s,
      l = (max + min) / 2;

  if (max == min) {
    s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
/**
 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
 */


function hsl2rgb(color) {
  let l = color[2];

  if (color[1] == 0) {
    l = Math.round(l * 255);
    return [l, l, l];
  } else {
    let s = color[1];
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    let r = hue2rgb(p, q, color[0] + 1 / 3);
    let g = hue2rgb(p, q, color[0]);
    let b = hue2rgb(p, q, color[0] - 1 / 3);
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
}

function toRGB(color) {
  let clamped = color.map(x => (0, _util.clamp)(x, 0, 255));
  return `rgb(${clamped.join(",")})`;
}

function toHex(color) {
  let clamped = color.map(x => (0, _util.clamp)(x, 0, 255).toString(16).padStart(2, "0"));
  return `#${clamped.join("")}`;
}

const CACHE = {
  "black": [0, 0, 0],
  "navy": [0, 0, 128],
  "darkblue": [0, 0, 139],
  "mediumblue": [0, 0, 205],
  "blue": [0, 0, 255],
  "darkgreen": [0, 100, 0],
  "green": [0, 128, 0],
  "teal": [0, 128, 128],
  "darkcyan": [0, 139, 139],
  "deepskyblue": [0, 191, 255],
  "darkturquoise": [0, 206, 209],
  "mediumspringgreen": [0, 250, 154],
  "lime": [0, 255, 0],
  "springgreen": [0, 255, 127],
  "aqua": [0, 255, 255],
  "cyan": [0, 255, 255],
  "midnightblue": [25, 25, 112],
  "dodgerblue": [30, 144, 255],
  "forestgreen": [34, 139, 34],
  "seagreen": [46, 139, 87],
  "darkslategray": [47, 79, 79],
  "darkslategrey": [47, 79, 79],
  "limegreen": [50, 205, 50],
  "mediumseagreen": [60, 179, 113],
  "turquoise": [64, 224, 208],
  "royalblue": [65, 105, 225],
  "steelblue": [70, 130, 180],
  "darkslateblue": [72, 61, 139],
  "mediumturquoise": [72, 209, 204],
  "indigo": [75, 0, 130],
  "darkolivegreen": [85, 107, 47],
  "cadetblue": [95, 158, 160],
  "cornflowerblue": [100, 149, 237],
  "mediumaquamarine": [102, 205, 170],
  "dimgray": [105, 105, 105],
  "dimgrey": [105, 105, 105],
  "slateblue": [106, 90, 205],
  "olivedrab": [107, 142, 35],
  "slategray": [112, 128, 144],
  "slategrey": [112, 128, 144],
  "lightslategray": [119, 136, 153],
  "lightslategrey": [119, 136, 153],
  "mediumslateblue": [123, 104, 238],
  "lawngreen": [124, 252, 0],
  "chartreuse": [127, 255, 0],
  "aquamarine": [127, 255, 212],
  "maroon": [128, 0, 0],
  "purple": [128, 0, 128],
  "olive": [128, 128, 0],
  "gray": [128, 128, 128],
  "grey": [128, 128, 128],
  "skyblue": [135, 206, 235],
  "lightskyblue": [135, 206, 250],
  "blueviolet": [138, 43, 226],
  "darkred": [139, 0, 0],
  "darkmagenta": [139, 0, 139],
  "saddlebrown": [139, 69, 19],
  "darkseagreen": [143, 188, 143],
  "lightgreen": [144, 238, 144],
  "mediumpurple": [147, 112, 216],
  "darkviolet": [148, 0, 211],
  "palegreen": [152, 251, 152],
  "darkorchid": [153, 50, 204],
  "yellowgreen": [154, 205, 50],
  "sienna": [160, 82, 45],
  "brown": [165, 42, 42],
  "darkgray": [169, 169, 169],
  "darkgrey": [169, 169, 169],
  "lightblue": [173, 216, 230],
  "greenyellow": [173, 255, 47],
  "paleturquoise": [175, 238, 238],
  "lightsteelblue": [176, 196, 222],
  "powderblue": [176, 224, 230],
  "firebrick": [178, 34, 34],
  "darkgoldenrod": [184, 134, 11],
  "mediumorchid": [186, 85, 211],
  "rosybrown": [188, 143, 143],
  "darkkhaki": [189, 183, 107],
  "silver": [192, 192, 192],
  "mediumvioletred": [199, 21, 133],
  "indianred": [205, 92, 92],
  "peru": [205, 133, 63],
  "chocolate": [210, 105, 30],
  "tan": [210, 180, 140],
  "lightgray": [211, 211, 211],
  "lightgrey": [211, 211, 211],
  "palevioletred": [216, 112, 147],
  "thistle": [216, 191, 216],
  "orchid": [218, 112, 214],
  "goldenrod": [218, 165, 32],
  "crimson": [220, 20, 60],
  "gainsboro": [220, 220, 220],
  "plum": [221, 160, 221],
  "burlywood": [222, 184, 135],
  "lightcyan": [224, 255, 255],
  "lavender": [230, 230, 250],
  "darksalmon": [233, 150, 122],
  "violet": [238, 130, 238],
  "palegoldenrod": [238, 232, 170],
  "lightcoral": [240, 128, 128],
  "khaki": [240, 230, 140],
  "aliceblue": [240, 248, 255],
  "honeydew": [240, 255, 240],
  "azure": [240, 255, 255],
  "sandybrown": [244, 164, 96],
  "wheat": [245, 222, 179],
  "beige": [245, 245, 220],
  "whitesmoke": [245, 245, 245],
  "mintcream": [245, 255, 250],
  "ghostwhite": [248, 248, 255],
  "salmon": [250, 128, 114],
  "antiquewhite": [250, 235, 215],
  "linen": [250, 240, 230],
  "lightgoldenrodyellow": [250, 250, 210],
  "oldlace": [253, 245, 230],
  "red": [255, 0, 0],
  "fuchsia": [255, 0, 255],
  "magenta": [255, 0, 255],
  "deeppink": [255, 20, 147],
  "orangered": [255, 69, 0],
  "tomato": [255, 99, 71],
  "hotpink": [255, 105, 180],
  "coral": [255, 127, 80],
  "darkorange": [255, 140, 0],
  "lightsalmon": [255, 160, 122],
  "orange": [255, 165, 0],
  "lightpink": [255, 182, 193],
  "pink": [255, 192, 203],
  "gold": [255, 215, 0],
  "peachpuff": [255, 218, 185],
  "navajowhite": [255, 222, 173],
  "moccasin": [255, 228, 181],
  "bisque": [255, 228, 196],
  "mistyrose": [255, 228, 225],
  "blanchedalmond": [255, 235, 205],
  "papayawhip": [255, 239, 213],
  "lavenderblush": [255, 240, 245],
  "seashell": [255, 245, 238],
  "cornsilk": [255, 248, 220],
  "lemonchiffon": [255, 250, 205],
  "floralwhite": [255, 250, 240],
  "snow": [255, 250, 250],
  "yellow": [255, 255, 0],
  "lightyellow": [255, 255, 224],
  "ivory": [255, 255, 240],
  "white": [255, 255, 255]
};
},{"./util.js":"../node_modules/rot-js/lib/util.js","./rng.js":"../node_modules/rot-js/lib/rng.js"}],"../node_modules/rot-js/lib/display/tile-gl.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _backend = _interopRequireDefault(require("./backend.js"));

var Color = _interopRequireWildcard(require("../color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Tile backend
 * @private
 */
class TileGL extends _backend.default {
  static isSupported() {
    return !!document.createElement("canvas").getContext("webgl2", {
      preserveDrawingBuffer: true
    });
  }

  constructor() {
    super();
    this._uniforms = {};

    try {
      this._gl = this._initWebGL();
    } catch (e) {
      alert(e.message);
    }
  }

  schedule(cb) {
    requestAnimationFrame(cb);
  }

  getContainer() {
    return this._gl.canvas;
  }

  setOptions(opts) {
    super.setOptions(opts);

    this._updateSize();

    let tileSet = this._options.tileSet;

    if (tileSet && "complete" in tileSet && !tileSet.complete) {
      tileSet.addEventListener("load", () => this._updateTexture(tileSet));
    } else {
      this._updateTexture(tileSet);
    }
  }

  draw(data, clearBefore) {
    const gl = this._gl;
    const opts = this._options;
    let [x, y, ch, fg, bg] = data;
    let scissorY = gl.canvas.height - (y + 1) * opts.tileHeight;
    gl.scissor(x * opts.tileWidth, scissorY, opts.tileWidth, opts.tileHeight);

    if (clearBefore) {
      if (opts.tileColorize) {
        gl.clearColor(0, 0, 0, 0);
      } else {
        gl.clearColor(...parseColor(bg));
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    if (!ch) {
      return;
    }

    let chars = [].concat(ch);
    let bgs = [].concat(bg);
    let fgs = [].concat(fg);
    gl.uniform2fv(this._uniforms["targetPosRel"], [x, y]);

    for (let i = 0; i < chars.length; i++) {
      let tile = this._options.tileMap[chars[i]];

      if (!tile) {
        throw new Error(`Char "${chars[i]}" not found in tileMap`);
      }

      gl.uniform1f(this._uniforms["colorize"], opts.tileColorize ? 1 : 0);
      gl.uniform2fv(this._uniforms["tilesetPosAbs"], tile);

      if (opts.tileColorize) {
        gl.uniform4fv(this._uniforms["tint"], parseColor(fgs[i]));
        gl.uniform4fv(this._uniforms["bg"], parseColor(bgs[i]));
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    /*
    
    
            for (let i=0;i<chars.length;i++) {
                
                if (this._options.tileColorize) { // apply colorization
                    let canvas = this._colorCanvas;
                    let context = canvas.getContext("2d") as CanvasRenderingContext2D;
                    context.globalCompositeOperation = "source-over";
                    context.clearRect(0, 0, tileWidth, tileHeight);
    
                    let fg = fgs[i];
                    let bg = bgs[i];
    
                    context.drawImage(
                        this._options.tileSet!,
                        tile[0], tile[1], tileWidth, tileHeight,
                        0, 0, tileWidth, tileHeight
                    );
    
                    if (fg != "transparent") {
                        context.fillStyle = fg;
                        context.globalCompositeOperation = "source-atop";
                        context.fillRect(0, 0, tileWidth, tileHeight);
                    }
    
                    if (bg != "transparent") {
                        context.fillStyle = bg;
                        context.globalCompositeOperation = "destination-over";
                        context.fillRect(0, 0, tileWidth, tileHeight);
                    }
    
                    this._ctx.drawImage(canvas, x*tileWidth, y*tileHeight, tileWidth, tileHeight);
                } else { // no colorizing, easy
                    this._ctx.drawImage(
                        this._options.tileSet!,
                        tile[0], tile[1], tileWidth, tileHeight,
                        x*tileWidth, y*tileHeight, tileWidth, tileHeight
                    );
                }
            }
    
    */

  }

  clear() {
    const gl = this._gl;
    gl.clearColor(...parseColor(this._options.bg));
    gl.scissor(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  computeSize(availWidth, availHeight) {
    let width = Math.floor(availWidth / this._options.tileWidth);
    let height = Math.floor(availHeight / this._options.tileHeight);
    return [width, height];
  }

  computeFontSize() {
    throw new Error("Tile backend does not understand font size");
  }

  eventToPosition(x, y) {
    let canvas = this._gl.canvas;
    let rect = canvas.getBoundingClientRect();
    x -= rect.left;
    y -= rect.top;
    x *= canvas.width / rect.width;
    y *= canvas.height / rect.height;

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
      return [-1, -1];
    }

    return this._normalizedEventToPosition(x, y);
  }

  _initWebGL() {
    let gl = document.createElement("canvas").getContext("webgl2", {
      preserveDrawingBuffer: true
    });
    window.gl = gl;
    let program = createProgram(gl, VS, FS);
    gl.useProgram(program);
    createQuad(gl);
    UNIFORMS.forEach(name => this._uniforms[name] = gl.getUniformLocation(program, name));
    this._program = program;
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.SCISSOR_TEST);
    return gl;
  }

  _normalizedEventToPosition(x, y) {
    return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
  }

  _updateSize() {
    const gl = this._gl;
    const opts = this._options;
    const canvasSize = [opts.width * opts.tileWidth, opts.height * opts.tileHeight];
    gl.canvas.width = canvasSize[0];
    gl.canvas.height = canvasSize[1];
    gl.viewport(0, 0, canvasSize[0], canvasSize[1]);
    gl.uniform2fv(this._uniforms["tileSize"], [opts.tileWidth, opts.tileHeight]);
    gl.uniform2fv(this._uniforms["targetSize"], canvasSize);
  }

  _updateTexture(tileSet) {
    createTexture(this._gl, tileSet);
  }

}

exports.default = TileGL;
const UNIFORMS = ["targetPosRel", "tilesetPosAbs", "tileSize", "targetSize", "colorize", "bg", "tint"];
const VS = `
#version 300 es

in vec2 tilePosRel;
out vec2 tilesetPosPx;

uniform vec2 tilesetPosAbs;
uniform vec2 tileSize;
uniform vec2 targetSize;
uniform vec2 targetPosRel;

void main() {
	vec2 targetPosPx = (targetPosRel + tilePosRel) * tileSize;
	vec2 targetPosNdc = ((targetPosPx / targetSize)-0.5)*2.0;
	targetPosNdc.y *= -1.0;

	gl_Position = vec4(targetPosNdc, 0.0, 1.0);
	tilesetPosPx = tilesetPosAbs + tilePosRel * tileSize;
}`.trim();
const FS = `
#version 300 es
precision highp float;

in vec2 tilesetPosPx;
out vec4 fragColor;
uniform sampler2D image;
uniform bool colorize;
uniform vec4 bg;
uniform vec4 tint;

void main() {
	fragColor = vec4(0, 0, 0, 1);

	vec4 texel = texelFetch(image, ivec2(tilesetPosPx), 0);

	if (colorize) {
		texel.rgb = tint.a * tint.rgb + (1.0-tint.a) * texel.rgb;
		fragColor.rgb = texel.a*texel.rgb + (1.0-texel.a)*bg.rgb;
		fragColor.a = texel.a + (1.0-texel.a)*bg.a;
	} else {
		fragColor = texel;
	}
}`.trim();

function createProgram(gl, vss, fss) {
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vss);
  gl.compileShader(vs);

  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(vs) || "");
  }

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fss);
  gl.compileShader(fs);

  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(fs) || "");
  }

  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);

  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) || "");
  }

  return p;
}

function createQuad(gl) {
  const pos = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
}

function createTexture(gl, data) {
  let t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
  return t;
}

let colorCache = {};

function parseColor(color) {
  if (!(color in colorCache)) {
    let parsed;

    if (color == "transparent") {
      parsed = [0, 0, 0, 0];
    } else if (color.indexOf("rgba") > -1) {
      parsed = (color.match(/[\d.]+/g) || []).map(Number);

      for (let i = 0; i < 3; i++) {
        parsed[i] = parsed[i] / 255;
      }
    } else {
      parsed = Color.fromString(color).map($ => $ / 255);
      parsed.push(1);
    }

    colorCache[color] = parsed;
  }

  return colorCache[color];
}
},{"./backend.js":"../node_modules/rot-js/lib/display/backend.js","../color.js":"../node_modules/rot-js/lib/color.js"}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/rot-js/lib/display/term.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _backend = _interopRequireDefault(require("./backend.js"));

var Color = _interopRequireWildcard(require("../color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function clearToAnsi(bg) {
  return `\x1b[0;48;5;${termcolor(bg)}m\x1b[2J`;
}

function colorToAnsi(fg, bg) {
  return `\x1b[0;38;5;${termcolor(fg)};48;5;${termcolor(bg)}m`;
}

function positionToAnsi(x, y) {
  return `\x1b[${y + 1};${x + 1}H`;
}

function termcolor(color) {
  const SRC_COLORS = 256.0;
  const DST_COLORS = 6.0;
  const COLOR_RATIO = DST_COLORS / SRC_COLORS;
  let rgb = Color.fromString(color);
  let r = Math.floor(rgb[0] * COLOR_RATIO);
  let g = Math.floor(rgb[1] * COLOR_RATIO);
  let b = Math.floor(rgb[2] * COLOR_RATIO);
  return r * 36 + g * 6 + b * 1 + 16;
}

class Term extends _backend.default {
  constructor() {
    super();
    this._offset = [0, 0];
    this._cursor = [-1, -1];
    this._lastColor = "";
  }

  schedule(cb) {
    setTimeout(cb, 1000 / 60);
  }

  setOptions(options) {
    super.setOptions(options);
    let size = [options.width, options.height];
    let avail = this.computeSize();
    this._offset = avail.map((val, index) => Math.floor((val - size[index]) / 2));
  }

  clear() {
    process.stdout.write(clearToAnsi(this._options.bg));
  }

  draw(data, clearBefore) {
    // determine where to draw what with what colors
    let [x, y, ch, fg, bg] = data; // determine if we need to move the terminal cursor

    let dx = this._offset[0] + x;
    let dy = this._offset[1] + y;
    let size = this.computeSize();

    if (dx < 0 || dx >= size[0]) {
      return;
    }

    if (dy < 0 || dy >= size[1]) {
      return;
    }

    if (dx !== this._cursor[0] || dy !== this._cursor[1]) {
      process.stdout.write(positionToAnsi(dx, dy));
      this._cursor[0] = dx;
      this._cursor[1] = dy;
    } // terminals automatically clear, but if we're clearing when we're
    // not otherwise provided with a character, just use a space instead


    if (clearBefore) {
      if (!ch) {
        ch = " ";
      }
    } // if we're not clearing and not provided with a character, do nothing


    if (!ch) {
      return;
    } // determine if we need to change colors


    let newColor = colorToAnsi(fg, bg);

    if (newColor !== this._lastColor) {
      process.stdout.write(newColor);
      this._lastColor = newColor;
    } // write the provided symbol to the display


    let chars = [].concat(ch);
    process.stdout.write(chars[0]); // update our position, given that we wrote a character

    this._cursor[0]++;

    if (this._cursor[0] >= size[0]) {
      this._cursor[0] = 0;
      this._cursor[1]++;
    }
  }

  computeFontSize() {
    throw new Error("Terminal backend has no notion of font size");
  }

  eventToPosition(x, y) {
    return [x, y];
  }

  computeSize() {
    return [process.stdout.columns, process.stdout.rows];
  }

}

exports.default = Term;
},{"./backend.js":"../node_modules/rot-js/lib/display/backend.js","../color.js":"../node_modules/rot-js/lib/color.js","process":"../node_modules/process/browser.js"}],"../node_modules/rot-js/lib/text.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.measure = measure;
exports.tokenize = tokenize;
exports.TYPE_BG = exports.TYPE_FG = exports.TYPE_NEWLINE = exports.TYPE_TEXT = void 0;

/**
 * @namespace
 * Contains text tokenization and breaking routines
 */
const RE_COLORS = /%([bc]){([^}]*)}/g; // token types

const TYPE_TEXT = 0;
exports.TYPE_TEXT = TYPE_TEXT;
const TYPE_NEWLINE = 1;
exports.TYPE_NEWLINE = TYPE_NEWLINE;
const TYPE_FG = 2;
exports.TYPE_FG = TYPE_FG;
const TYPE_BG = 3;
/**
 * Measure size of a resulting text block
 */

exports.TYPE_BG = TYPE_BG;

function measure(str, maxWidth) {
  let result = {
    width: 0,
    height: 1
  };
  let tokens = tokenize(str, maxWidth);
  let lineWidth = 0;

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    switch (token.type) {
      case TYPE_TEXT:
        lineWidth += token.value.length;
        break;

      case TYPE_NEWLINE:
        result.height++;
        result.width = Math.max(result.width, lineWidth);
        lineWidth = 0;
        break;
    }
  }

  result.width = Math.max(result.width, lineWidth);
  return result;
}
/**
 * Convert string to a series of a formatting commands
 */


function tokenize(str, maxWidth) {
  let result = [];
  /* first tokenization pass - split texts and color formatting commands */

  let offset = 0;
  str.replace(RE_COLORS, function (match, type, name, index) {
    /* string before */
    let part = str.substring(offset, index);

    if (part.length) {
      result.push({
        type: TYPE_TEXT,
        value: part
      });
    }
    /* color command */


    result.push({
      type: type == "c" ? TYPE_FG : TYPE_BG,
      value: name.trim()
    });
    offset = index + match.length;
    return "";
  });
  /* last remaining part */

  let part = str.substring(offset);

  if (part.length) {
    result.push({
      type: TYPE_TEXT,
      value: part
    });
  }

  return breakLines(result, maxWidth);
}
/* insert line breaks into first-pass tokenized data */


function breakLines(tokens, maxWidth) {
  if (!maxWidth) {
    maxWidth = Infinity;
  }

  let i = 0;
  let lineLength = 0;
  let lastTokenWithSpace = -1;

  while (i < tokens.length) {
    /* take all text tokens, remove space, apply linebreaks */
    let token = tokens[i];

    if (token.type == TYPE_NEWLINE) {
      /* reset */
      lineLength = 0;
      lastTokenWithSpace = -1;
    }

    if (token.type != TYPE_TEXT) {
      /* skip non-text tokens */
      i++;
      continue;
    }
    /* remove spaces at the beginning of line */


    while (lineLength == 0 && token.value.charAt(0) == " ") {
      token.value = token.value.substring(1);
    }
    /* forced newline? insert two new tokens after this one */


    let index = token.value.indexOf("\n");

    if (index != -1) {
      token.value = breakInsideToken(tokens, i, index, true);
      /* if there are spaces at the end, we must remove them (we do not want the line too long) */

      let arr = token.value.split("");

      while (arr.length && arr[arr.length - 1] == " ") {
        arr.pop();
      }

      token.value = arr.join("");
    }
    /* token degenerated? */


    if (!token.value.length) {
      tokens.splice(i, 1);
      continue;
    }

    if (lineLength + token.value.length > maxWidth) {
      /* line too long, find a suitable breaking spot */

      /* is it possible to break within this token? */
      let index = -1;

      while (1) {
        let nextIndex = token.value.indexOf(" ", index + 1);

        if (nextIndex == -1) {
          break;
        }

        if (lineLength + nextIndex > maxWidth) {
          break;
        }

        index = nextIndex;
      }

      if (index != -1) {
        /* break at space within this one */
        token.value = breakInsideToken(tokens, i, index, true);
      } else if (lastTokenWithSpace != -1) {
        /* is there a previous token where a break can occur? */
        let token = tokens[lastTokenWithSpace];
        let breakIndex = token.value.lastIndexOf(" ");
        token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
        i = lastTokenWithSpace;
      } else {
        /* force break in this token */
        token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
      }
    } else {
      /* line not long, continue */
      lineLength += token.value.length;

      if (token.value.indexOf(" ") != -1) {
        lastTokenWithSpace = i;
      }
    }

    i++;
    /* advance to next token */
  }

  tokens.push({
    type: TYPE_NEWLINE
  });
  /* insert fake newline to fix the last text line */

  /* remove trailing space from text tokens before newlines */

  let lastTextToken = null;

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    switch (token.type) {
      case TYPE_TEXT:
        lastTextToken = token;
        break;

      case TYPE_NEWLINE:
        if (lastTextToken) {
          /* remove trailing space */
          let arr = lastTextToken.value.split("");

          while (arr.length && arr[arr.length - 1] == " ") {
            arr.pop();
          }

          lastTextToken.value = arr.join("");
        }

        lastTextToken = null;
        break;
    }
  }

  tokens.pop();
  /* remove fake token */

  return tokens;
}
/**
 * Create new tokens and insert them into the stream
 * @param {object[]} tokens
 * @param {int} tokenIndex Token being processed
 * @param {int} breakIndex Index within current token's value
 * @param {bool} removeBreakChar Do we want to remove the breaking character?
 * @returns {string} remaining unbroken token value
 */


function breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
  let newBreakToken = {
    type: TYPE_NEWLINE
  };
  let newTextToken = {
    type: TYPE_TEXT,
    value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
  };
  tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
  return tokens[tokenIndex].value.substring(0, breakIndex);
}
},{}],"../node_modules/rot-js/lib/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KEYS = exports.DIRS = exports.DEFAULT_HEIGHT = exports.DEFAULT_WIDTH = void 0;

/** Default with for display and map generators */
let DEFAULT_WIDTH = 80;
/** Default height for display and map generators */

exports.DEFAULT_WIDTH = DEFAULT_WIDTH;
let DEFAULT_HEIGHT = 25;
exports.DEFAULT_HEIGHT = DEFAULT_HEIGHT;
const DIRS = {
  4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
  8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
  6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
};
exports.DIRS = DIRS;
const KEYS = {
  /** Cancel key. */
  VK_CANCEL: 3,

  /** Help key. */
  VK_HELP: 6,

  /** Backspace key. */
  VK_BACK_SPACE: 8,

  /** Tab key. */
  VK_TAB: 9,

  /** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
  VK_CLEAR: 12,

  /** Return/enter key on the main keyboard. */
  VK_RETURN: 13,

  /** Reserved, but not used. */
  VK_ENTER: 14,

  /** Shift key. */
  VK_SHIFT: 16,

  /** Control key. */
  VK_CONTROL: 17,

  /** Alt (Option on Mac) key. */
  VK_ALT: 18,

  /** Pause key. */
  VK_PAUSE: 19,

  /** Caps lock. */
  VK_CAPS_LOCK: 20,

  /** Escape key. */
  VK_ESCAPE: 27,

  /** Space bar. */
  VK_SPACE: 32,

  /** Page Up key. */
  VK_PAGE_UP: 33,

  /** Page Down key. */
  VK_PAGE_DOWN: 34,

  /** End key. */
  VK_END: 35,

  /** Home key. */
  VK_HOME: 36,

  /** Left arrow. */
  VK_LEFT: 37,

  /** Up arrow. */
  VK_UP: 38,

  /** Right arrow. */
  VK_RIGHT: 39,

  /** Down arrow. */
  VK_DOWN: 40,

  /** Print Screen key. */
  VK_PRINTSCREEN: 44,

  /** Ins(ert) key. */
  VK_INSERT: 45,

  /** Del(ete) key. */
  VK_DELETE: 46,

  /***/
  VK_0: 48,

  /***/
  VK_1: 49,

  /***/
  VK_2: 50,

  /***/
  VK_3: 51,

  /***/
  VK_4: 52,

  /***/
  VK_5: 53,

  /***/
  VK_6: 54,

  /***/
  VK_7: 55,

  /***/
  VK_8: 56,

  /***/
  VK_9: 57,

  /** Colon (:) key. Requires Gecko 15.0 */
  VK_COLON: 58,

  /** Semicolon (;) key. */
  VK_SEMICOLON: 59,

  /** Less-than (<) key. Requires Gecko 15.0 */
  VK_LESS_THAN: 60,

  /** Equals (=) key. */
  VK_EQUALS: 61,

  /** Greater-than (>) key. Requires Gecko 15.0 */
  VK_GREATER_THAN: 62,

  /** Question mark (?) key. Requires Gecko 15.0 */
  VK_QUESTION_MARK: 63,

  /** Atmark (@) key. Requires Gecko 15.0 */
  VK_AT: 64,

  /***/
  VK_A: 65,

  /***/
  VK_B: 66,

  /***/
  VK_C: 67,

  /***/
  VK_D: 68,

  /***/
  VK_E: 69,

  /***/
  VK_F: 70,

  /***/
  VK_G: 71,

  /***/
  VK_H: 72,

  /***/
  VK_I: 73,

  /***/
  VK_J: 74,

  /***/
  VK_K: 75,

  /***/
  VK_L: 76,

  /***/
  VK_M: 77,

  /***/
  VK_N: 78,

  /***/
  VK_O: 79,

  /***/
  VK_P: 80,

  /***/
  VK_Q: 81,

  /***/
  VK_R: 82,

  /***/
  VK_S: 83,

  /***/
  VK_T: 84,

  /***/
  VK_U: 85,

  /***/
  VK_V: 86,

  /***/
  VK_W: 87,

  /***/
  VK_X: 88,

  /***/
  VK_Y: 89,

  /***/
  VK_Z: 90,

  /***/
  VK_CONTEXT_MENU: 93,

  /** 0 on the numeric keypad. */
  VK_NUMPAD0: 96,

  /** 1 on the numeric keypad. */
  VK_NUMPAD1: 97,

  /** 2 on the numeric keypad. */
  VK_NUMPAD2: 98,

  /** 3 on the numeric keypad. */
  VK_NUMPAD3: 99,

  /** 4 on the numeric keypad. */
  VK_NUMPAD4: 100,

  /** 5 on the numeric keypad. */
  VK_NUMPAD5: 101,

  /** 6 on the numeric keypad. */
  VK_NUMPAD6: 102,

  /** 7 on the numeric keypad. */
  VK_NUMPAD7: 103,

  /** 8 on the numeric keypad. */
  VK_NUMPAD8: 104,

  /** 9 on the numeric keypad. */
  VK_NUMPAD9: 105,

  /** * on the numeric keypad. */
  VK_MULTIPLY: 106,

  /** + on the numeric keypad. */
  VK_ADD: 107,

  /***/
  VK_SEPARATOR: 108,

  /** - on the numeric keypad. */
  VK_SUBTRACT: 109,

  /** Decimal point on the numeric keypad. */
  VK_DECIMAL: 110,

  /** / on the numeric keypad. */
  VK_DIVIDE: 111,

  /** F1 key. */
  VK_F1: 112,

  /** F2 key. */
  VK_F2: 113,

  /** F3 key. */
  VK_F3: 114,

  /** F4 key. */
  VK_F4: 115,

  /** F5 key. */
  VK_F5: 116,

  /** F6 key. */
  VK_F6: 117,

  /** F7 key. */
  VK_F7: 118,

  /** F8 key. */
  VK_F8: 119,

  /** F9 key. */
  VK_F9: 120,

  /** F10 key. */
  VK_F10: 121,

  /** F11 key. */
  VK_F11: 122,

  /** F12 key. */
  VK_F12: 123,

  /** F13 key. */
  VK_F13: 124,

  /** F14 key. */
  VK_F14: 125,

  /** F15 key. */
  VK_F15: 126,

  /** F16 key. */
  VK_F16: 127,

  /** F17 key. */
  VK_F17: 128,

  /** F18 key. */
  VK_F18: 129,

  /** F19 key. */
  VK_F19: 130,

  /** F20 key. */
  VK_F20: 131,

  /** F21 key. */
  VK_F21: 132,

  /** F22 key. */
  VK_F22: 133,

  /** F23 key. */
  VK_F23: 134,

  /** F24 key. */
  VK_F24: 135,

  /** Num Lock key. */
  VK_NUM_LOCK: 144,

  /** Scroll Lock key. */
  VK_SCROLL_LOCK: 145,

  /** Circumflex (^) key. Requires Gecko 15.0 */
  VK_CIRCUMFLEX: 160,

  /** Exclamation (!) key. Requires Gecko 15.0 */
  VK_EXCLAMATION: 161,

  /** Double quote () key. Requires Gecko 15.0 */
  VK_DOUBLE_QUOTE: 162,

  /** Hash (#) key. Requires Gecko 15.0 */
  VK_HASH: 163,

  /** Dollar sign ($) key. Requires Gecko 15.0 */
  VK_DOLLAR: 164,

  /** Percent (%) key. Requires Gecko 15.0 */
  VK_PERCENT: 165,

  /** Ampersand (&) key. Requires Gecko 15.0 */
  VK_AMPERSAND: 166,

  /** Underscore (_) key. Requires Gecko 15.0 */
  VK_UNDERSCORE: 167,

  /** Open parenthesis (() key. Requires Gecko 15.0 */
  VK_OPEN_PAREN: 168,

  /** Close parenthesis ()) key. Requires Gecko 15.0 */
  VK_CLOSE_PAREN: 169,

  /* Asterisk (*) key. Requires Gecko 15.0 */
  VK_ASTERISK: 170,

  /** Plus (+) key. Requires Gecko 15.0 */
  VK_PLUS: 171,

  /** Pipe (|) key. Requires Gecko 15.0 */
  VK_PIPE: 172,

  /** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
  VK_HYPHEN_MINUS: 173,

  /** Open curly bracket ({) key. Requires Gecko 15.0 */
  VK_OPEN_CURLY_BRACKET: 174,

  /** Close curly bracket (}) key. Requires Gecko 15.0 */
  VK_CLOSE_CURLY_BRACKET: 175,

  /** Tilde (~) key. Requires Gecko 15.0 */
  VK_TILDE: 176,

  /** Comma (,) key. */
  VK_COMMA: 188,

  /** Period (.) key. */
  VK_PERIOD: 190,

  /** Slash (/) key. */
  VK_SLASH: 191,

  /** Back tick (`) key. */
  VK_BACK_QUOTE: 192,

  /** Open square bracket ([) key. */
  VK_OPEN_BRACKET: 219,

  /** Back slash (\) key. */
  VK_BACK_SLASH: 220,

  /** Close square bracket (]) key. */
  VK_CLOSE_BRACKET: 221,

  /** Quote (''') key. */
  VK_QUOTE: 222,

  /** Meta key on Linux, Command key on Mac. */
  VK_META: 224,

  /** AltGr key on Linux. Requires Gecko 15.0 */
  VK_ALTGR: 225,

  /** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
  VK_WIN: 91,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_KANA: 21,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_HANGUL: 21,

  /** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
  VK_EISU: 22,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_JUNJA: 23,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_FINAL: 24,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_HANJA: 25,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_KANJI: 25,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_CONVERT: 28,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_NONCONVERT: 29,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_ACCEPT: 30,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_MODECHANGE: 31,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_SELECT: 41,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_PRINT: 42,

  /** Linux support for this keycode was added in Gecko 4.0. */
  VK_EXECUTE: 43,

  /** Linux support for this keycode was added in Gecko 4.0.	 */
  VK_SLEEP: 95
};
exports.KEYS = KEYS;
},{}],"../node_modules/rot-js/lib/display/display.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hex = _interopRequireDefault(require("./hex.js"));

var _rect = _interopRequireDefault(require("./rect.js"));

var _tile = _interopRequireDefault(require("./tile.js"));

var _tileGl = _interopRequireDefault(require("./tile-gl.js"));

var _term = _interopRequireDefault(require("./term.js"));

var Text = _interopRequireWildcard(require("../text.js"));

var _constants = require("../constants.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BACKENDS = {
  "hex": _hex.default,
  "rect": _rect.default,
  "tile": _tile.default,
  "tile-gl": _tileGl.default,
  "term": _term.default
};
const DEFAULT_OPTIONS = {
  width: _constants.DEFAULT_WIDTH,
  height: _constants.DEFAULT_HEIGHT,
  transpose: false,
  layout: "rect",
  fontSize: 15,
  spacing: 1,
  border: 0,
  forceSquareRatio: false,
  fontFamily: "monospace",
  fontStyle: "",
  fg: "#ccc",
  bg: "#000",
  tileWidth: 32,
  tileHeight: 32,
  tileMap: {},
  tileSet: null,
  tileColorize: false
};
/**
 * @class Visual map display
 */

class Display {
  constructor(options = {}) {
    this._data = {};
    this._dirty = false; // false = nothing, true = all, object = dirty cells

    this._options = {};
    options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.setOptions(options);
    this.DEBUG = this.DEBUG.bind(this);
    this._tick = this._tick.bind(this);

    this._backend.schedule(this._tick);
  }
  /**
   * Debug helper, ideal as a map generator callback. Always bound to this.
   * @param {int} x
   * @param {int} y
   * @param {int} what
   */


  DEBUG(x, y, what) {
    let colors = [this._options.bg, this._options.fg];
    this.draw(x, y, null, null, colors[what % colors.length]);
  }
  /**
   * Clear the whole display (cover it with background color)
   */


  clear() {
    this._data = {};
    this._dirty = true;
  }
  /**
   * @see ROT.Display
   */


  setOptions(options) {
    Object.assign(this._options, options);

    if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
      if (options.layout) {
        let ctor = BACKENDS[options.layout];
        this._backend = new ctor();
      }

      this._backend.setOptions(this._options);

      this._dirty = true;
    }

    return this;
  }
  /**
   * Returns currently set options
   */


  getOptions() {
    return this._options;
  }
  /**
   * Returns the DOM node of this display
   */


  getContainer() {
    return this._backend.getContainer();
  }
  /**
   * Compute the maximum width/height to fit into a set of given constraints
   * @param {int} availWidth Maximum allowed pixel width
   * @param {int} availHeight Maximum allowed pixel height
   * @returns {int[2]} cellWidth,cellHeight
   */


  computeSize(availWidth, availHeight) {
    return this._backend.computeSize(availWidth, availHeight);
  }
  /**
   * Compute the maximum font size to fit into a set of given constraints
   * @param {int} availWidth Maximum allowed pixel width
   * @param {int} availHeight Maximum allowed pixel height
   * @returns {int} fontSize
   */


  computeFontSize(availWidth, availHeight) {
    return this._backend.computeFontSize(availWidth, availHeight);
  }

  computeTileSize(availWidth, availHeight) {
    let width = Math.floor(availWidth / this._options.width);
    let height = Math.floor(availHeight / this._options.height);
    return [width, height];
  }
  /**
   * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
   * @param {Event} e event
   * @returns {int[2]} -1 for values outside of the canvas
   */


  eventToPosition(e) {
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    return this._backend.eventToPosition(x, y);
  }
  /**
   * @param {int} x
   * @param {int} y
   * @param {string || string[]} ch One or more chars (will be overlapping themselves)
   * @param {string} [fg] foreground color
   * @param {string} [bg] background color
   */


  draw(x, y, ch, fg, bg) {
    if (!fg) {
      fg = this._options.fg;
    }

    if (!bg) {
      bg = this._options.bg;
    }

    let key = `${x},${y}`;
    this._data[key] = [x, y, ch, fg, bg];

    if (this._dirty === true) {
      return;
    } // will already redraw everything 


    if (!this._dirty) {
      this._dirty = {};
    } // first!


    this._dirty[key] = true;
  }
  /**
   * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
   * @param {int} x
   * @param {int} y
   * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
   * @param {int} [maxWidth] wrap at what width?
   * @returns {int} lines drawn
   */


  drawText(x, y, text, maxWidth) {
    let fg = null;
    let bg = null;
    let cx = x;
    let cy = y;
    let lines = 1;

    if (!maxWidth) {
      maxWidth = this._options.width - x;
    }

    let tokens = Text.tokenize(text, maxWidth);

    while (tokens.length) {
      // interpret tokenized opcode stream
      let token = tokens.shift();

      switch (token.type) {
        case Text.TYPE_TEXT:
          let isSpace = false,
              isPrevSpace = false,
              isFullWidth = false,
              isPrevFullWidth = false;

          for (let i = 0; i < token.value.length; i++) {
            let cc = token.value.charCodeAt(i);
            let c = token.value.charAt(i); // Assign to `true` when the current char is full-width.

            isFullWidth = cc > 0xff00 && cc < 0xff61 || cc > 0xffdc && cc < 0xffe8 || cc > 0xffee; // Current char is space, whatever full-width or half-width both are OK.

            isSpace = c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000; // The previous char is full-width and
            // current char is nether half-width nor a space.

            if (isPrevFullWidth && !isFullWidth && !isSpace) {
              cx++;
            } // add an extra position
            // The current char is full-width and
            // the previous char is not a space.


            if (isFullWidth && !isPrevSpace) {
              cx++;
            } // add an extra position


            this.draw(cx++, cy, c, fg, bg);
            isPrevSpace = isSpace;
            isPrevFullWidth = isFullWidth;
          }

          break;

        case Text.TYPE_FG:
          fg = token.value || null;
          break;

        case Text.TYPE_BG:
          bg = token.value || null;
          break;

        case Text.TYPE_NEWLINE:
          cx = x;
          cy++;
          lines++;
          break;
      }
    }

    return lines;
  }
  /**
   * Timer tick: update dirty parts
   */


  _tick() {
    this._backend.schedule(this._tick);

    if (!this._dirty) {
      return;
    }

    if (this._dirty === true) {
      // draw all
      this._backend.clear();

      for (let id in this._data) {
        this._draw(id, false);
      } // redraw cached data 

    } else {
      // draw only dirty 
      for (let key in this._dirty) {
        this._draw(key, true);
      }
    }

    this._dirty = false;
  }
  /**
   * @param {string} key What to draw
   * @param {bool} clearBefore Is it necessary to clean before?
   */


  _draw(key, clearBefore) {
    let data = this._data[key];

    if (data[4] != this._options.bg) {
      clearBefore = true;
    }

    this._backend.draw(data, clearBefore);
  }

}

exports.default = Display;
Display.Rect = _rect.default;
Display.Hex = _hex.default;
Display.Tile = _tile.default;
Display.TileGL = _tileGl.default;
Display.Term = _term.default;
},{"./hex.js":"../node_modules/rot-js/lib/display/hex.js","./rect.js":"../node_modules/rot-js/lib/display/rect.js","./tile.js":"../node_modules/rot-js/lib/display/tile.js","./tile-gl.js":"../node_modules/rot-js/lib/display/tile-gl.js","./term.js":"../node_modules/rot-js/lib/display/term.js","../text.js":"../node_modules/rot-js/lib/text.js","../constants.js":"../node_modules/rot-js/lib/constants.js"}],"../node_modules/rot-js/lib/stringgenerator.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class (Markov process)-based string generator.
 * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
 * Offers configurable order and prior.
 */
class StringGenerator {
  constructor(options) {
    this._options = {
      words: false,
      order: 3,
      prior: 0.001
    };
    Object.assign(this._options, options);
    this._boundary = String.fromCharCode(0);
    this._suffix = this._boundary;
    this._prefix = [];

    for (let i = 0; i < this._options.order; i++) {
      this._prefix.push(this._boundary);
    }

    this._priorValues = {};
    this._priorValues[this._boundary] = this._options.prior;
    this._data = {};
  }
  /**
   * Remove all learning data
   */


  clear() {
    this._data = {};
    this._priorValues = {};
  }
  /**
   * @returns {string} Generated string
   */


  generate() {
    let result = [this._sample(this._prefix)];

    while (result[result.length - 1] != this._boundary) {
      result.push(this._sample(result));
    }

    return this._join(result.slice(0, -1));
  }
  /**
   * Observe (learn) a string from a training set
   */


  observe(string) {
    let tokens = this._split(string);

    for (let i = 0; i < tokens.length; i++) {
      this._priorValues[tokens[i]] = this._options.prior;
    }

    tokens = this._prefix.concat(tokens).concat(this._suffix);
    /* add boundary symbols */

    for (let i = this._options.order; i < tokens.length; i++) {
      let context = tokens.slice(i - this._options.order, i);
      let event = tokens[i];

      for (let j = 0; j < context.length; j++) {
        let subcontext = context.slice(j);

        this._observeEvent(subcontext, event);
      }
    }
  }

  getStats() {
    let parts = [];
    let priorCount = Object.keys(this._priorValues).length;
    priorCount--; // boundary

    parts.push("distinct samples: " + priorCount);
    let dataCount = Object.keys(this._data).length;
    let eventCount = 0;

    for (let p in this._data) {
      eventCount += Object.keys(this._data[p]).length;
    }

    parts.push("dictionary size (contexts): " + dataCount);
    parts.push("dictionary size (events): " + eventCount);
    return parts.join(", ");
  }
  /**
   * @param {string}
   * @returns {string[]}
   */


  _split(str) {
    return str.split(this._options.words ? /\s+/ : "");
  }
  /**
   * @param {string[]}
   * @returns {string}
   */


  _join(arr) {
    return arr.join(this._options.words ? " " : "");
  }
  /**
   * @param {string[]} context
   * @param {string} event
   */


  _observeEvent(context, event) {
    let key = this._join(context);

    if (!(key in this._data)) {
      this._data[key] = {};
    }

    let data = this._data[key];

    if (!(event in data)) {
      data[event] = 0;
    }

    data[event]++;
  }
  /**
   * @param {string[]}
   * @returns {string}
   */


  _sample(context) {
    context = this._backoff(context);

    let key = this._join(context);

    let data = this._data[key];
    let available = {};

    if (this._options.prior) {
      for (let event in this._priorValues) {
        available[event] = this._priorValues[event];
      }

      for (let event in data) {
        available[event] += data[event];
      }
    } else {
      available = data;
    }

    return _rng.default.getWeightedValue(available);
  }
  /**
   * @param {string[]}
   * @returns {string[]}
   */


  _backoff(context) {
    if (context.length > this._options.order) {
      context = context.slice(-this._options.order);
    } else if (context.length < this._options.order) {
      context = this._prefix.slice(0, this._options.order - context.length).concat(context);
    }

    while (!(this._join(context) in this._data) && context.length > 0) {
      context = context.slice(1);
    }

    return context;
  }

}

exports.default = StringGenerator;
},{"./rng.js":"../node_modules/rot-js/lib/rng.js"}],"../node_modules/rot-js/lib/eventqueue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class EventQueue {
  /**
   * @class Generic event queue: stores events and retrieves them based on their time
   */
  constructor() {
    this._time = 0;
    this._events = [];
    this._eventTimes = [];
  }
  /**
   * @returns {number} Elapsed time
   */


  getTime() {
    return this._time;
  }
  /**
   * Clear all scheduled events
   */


  clear() {
    this._events = [];
    this._eventTimes = [];
    return this;
  }
  /**
   * @param {?} event
   * @param {number} time
   */


  add(event, time) {
    let index = this._events.length;

    for (let i = 0; i < this._eventTimes.length; i++) {
      if (this._eventTimes[i] > time) {
        index = i;
        break;
      }
    }

    this._events.splice(index, 0, event);

    this._eventTimes.splice(index, 0, time);
  }
  /**
   * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
   * @returns {? || null} The event previously added by addEvent, null if no event available
   */


  get() {
    if (!this._events.length) {
      return null;
    }

    let time = this._eventTimes.splice(0, 1)[0];

    if (time > 0) {
      /* advance */
      this._time += time;

      for (let i = 0; i < this._eventTimes.length; i++) {
        this._eventTimes[i] -= time;
      }
    }

    return this._events.splice(0, 1)[0];
  }
  /**
   * Get the time associated with the given event
   * @param {?} event
   * @returns {number} time
   */


  getEventTime(event) {
    let index = this._events.indexOf(event);

    if (index == -1) {
      return undefined;
    }

    return this._eventTimes[index];
  }
  /**
   * Remove an event from the queue
   * @param {?} event
   * @returns {bool} success?
   */


  remove(event) {
    let index = this._events.indexOf(event);

    if (index == -1) {
      return false;
    }

    this._remove(index);

    return true;
  }

  /**
   * Remove an event from the queue
   * @param {int} index
   */
  _remove(index) {
    this._events.splice(index, 1);

    this._eventTimes.splice(index, 1);
  }

}

exports.default = EventQueue;
},{}],"../node_modules/rot-js/lib/scheduler/scheduler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventqueue = _interopRequireDefault(require("../eventqueue.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Scheduler {
  /**
   * @class Abstract scheduler
   */
  constructor() {
    this._queue = new _eventqueue.default();
    this._repeat = [];
    this._current = null;
  }
  /**
   * @see ROT.EventQueue#getTime
   */


  getTime() {
    return this._queue.getTime();
  }
  /**
   * @param {?} item
   * @param {bool} repeat
   */


  add(item, repeat) {
    if (repeat) {
      this._repeat.push(item);
    }

    return this;
  }
  /**
   * Get the time the given item is scheduled for
   * @param {?} item
   * @returns {number} time
   */


  getTimeOf(item) {
    return this._queue.getEventTime(item);
  }
  /**
   * Clear all items
   */


  clear() {
    this._queue.clear();

    this._repeat = [];
    this._current = null;
    return this;
  }
  /**
   * Remove a previously added item
   * @param {?} item
   * @returns {bool} successful?
   */


  remove(item) {
    let result = this._queue.remove(item);

    let index = this._repeat.indexOf(item);

    if (index != -1) {
      this._repeat.splice(index, 1);
    }

    if (this._current == item) {
      this._current = null;
    }

    return result;
  }
  /**
   * Schedule next item
   * @returns {?}
   */


  next() {
    this._current = this._queue.get();
    return this._current;
  }

}

exports.default = Scheduler;
},{"../eventqueue.js":"../node_modules/rot-js/lib/eventqueue.js"}],"../node_modules/rot-js/lib/scheduler/simple.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scheduler = _interopRequireDefault(require("./scheduler.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Simple fair scheduler (round-robin style)
 */
class Simple extends _scheduler.default {
  add(item, repeat) {
    this._queue.add(item, 0);

    return super.add(item, repeat);
  }

  next() {
    if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
      this._queue.add(this._current, 0);
    }

    return super.next();
  }

}

exports.default = Simple;
},{"./scheduler.js":"../node_modules/rot-js/lib/scheduler/scheduler.js"}],"../node_modules/rot-js/lib/scheduler/speed.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scheduler = _interopRequireDefault(require("./scheduler.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Speed-based scheduler
 */
class Speed extends _scheduler.default {
  /**
   * @param {object} item anything with "getSpeed" method
   * @param {bool} repeat
   * @param {number} [time=1/item.getSpeed()]
   * @see ROT.Scheduler#add
   */
  add(item, repeat, time) {
    this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());

    return super.add(item, repeat);
  }
  /**
   * @see ROT.Scheduler#next
   */


  next() {
    if (this._current && this._repeat.indexOf(this._current) != -1) {
      this._queue.add(this._current, 1 / this._current.getSpeed());
    }

    return super.next();
  }

}

exports.default = Speed;
},{"./scheduler.js":"../node_modules/rot-js/lib/scheduler/scheduler.js"}],"../node_modules/rot-js/lib/scheduler/action.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scheduler = _interopRequireDefault(require("./scheduler.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Action-based scheduler
 * @augments ROT.Scheduler
 */
class Action extends _scheduler.default {
  constructor() {
    super();
    this._defaultDuration = 1;
    /* for newly added */

    this._duration = this._defaultDuration;
    /* for this._current */
  }
  /**
   * @param {object} item
   * @param {bool} repeat
   * @param {number} [time=1]
   * @see ROT.Scheduler#add
   */


  add(item, repeat, time) {
    this._queue.add(item, time || this._defaultDuration);

    return super.add(item, repeat);
  }

  clear() {
    this._duration = this._defaultDuration;
    return super.clear();
  }

  remove(item) {
    if (item == this._current) {
      this._duration = this._defaultDuration;
    }

    return super.remove(item);
  }
  /**
   * @see ROT.Scheduler#next
   */


  next() {
    if (this._current !== null && this._repeat.indexOf(this._current) != -1) {
      this._queue.add(this._current, this._duration || this._defaultDuration);

      this._duration = this._defaultDuration;
    }

    return super.next();
  }
  /**
   * Set duration for the active item
   */


  setDuration(time) {
    if (this._current) {
      this._duration = time;
    }

    return this;
  }

}

exports.default = Action;
},{"./scheduler.js":"../node_modules/rot-js/lib/scheduler/scheduler.js"}],"../node_modules/rot-js/lib/scheduler/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _simple = _interopRequireDefault(require("./simple.js"));

var _speed = _interopRequireDefault(require("./speed.js"));

var _action = _interopRequireDefault(require("./action.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Simple: _simple.default,
  Speed: _speed.default,
  Action: _action.default
};
exports.default = _default;
},{"./simple.js":"../node_modules/rot-js/lib/scheduler/simple.js","./speed.js":"../node_modules/rot-js/lib/scheduler/speed.js","./action.js":"../node_modules/rot-js/lib/scheduler/action.js"}],"../node_modules/rot-js/lib/fov/fov.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants.js");

;
;

class FOV {
  /**
   * @class Abstract FOV algorithm
   * @param {function} lightPassesCallback Does the light pass through x,y?
   * @param {object} [options]
   * @param {int} [options.topology=8] 4/6/8
   */
  constructor(lightPassesCallback, options = {}) {
    this._lightPasses = lightPassesCallback;
    this._options = Object.assign({
      topology: 8
    }, options);
  }
  /**
   * Return all neighbors in a concentric ring
   * @param {int} cx center-x
   * @param {int} cy center-y
   * @param {int} r range
   */


  _getCircle(cx, cy, r) {
    let result = [];
    let dirs, countFactor, startOffset;

    switch (this._options.topology) {
      case 4:
        countFactor = 1;
        startOffset = [0, 1];
        dirs = [_constants.DIRS[8][7], _constants.DIRS[8][1], _constants.DIRS[8][3], _constants.DIRS[8][5]];
        break;

      case 6:
        dirs = _constants.DIRS[6];
        countFactor = 1;
        startOffset = [-1, 1];
        break;

      case 8:
        dirs = _constants.DIRS[4];
        countFactor = 2;
        startOffset = [-1, 1];
        break;

      default:
        throw new Error("Incorrect topology for FOV computation");
        break;
    }
    /* starting neighbor */


    let x = cx + startOffset[0] * r;
    let y = cy + startOffset[1] * r;
    /* circle */

    for (let i = 0; i < dirs.length; i++) {
      for (let j = 0; j < r * countFactor; j++) {
        result.push([x, y]);
        x += dirs[i][0];
        y += dirs[i][1];
      }
    }

    return result;
  }

}

exports.default = FOV;
},{"../constants.js":"../node_modules/rot-js/lib/constants.js"}],"../node_modules/rot-js/lib/fov/discrete-shadowcasting.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fov = _interopRequireDefault(require("./fov.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
 * @augments ROT.FOV
 */
class DiscreteShadowcasting extends _fov.default {
  compute(x, y, R, callback) {
    /* this place is always visible */
    callback(x, y, 0, 1);
    /* standing in a dark place. FIXME is this a good idea?  */

    if (!this._lightPasses(x, y)) {
      return;
    }
    /* start and end angles */


    let DATA = [];
    let A, B, cx, cy, blocks;
    /* analyze surrounding cells in concentric rings, starting from the center */

    for (let r = 1; r <= R; r++) {
      let neighbors = this._getCircle(x, y, r);

      let angle = 360 / neighbors.length;

      for (let i = 0; i < neighbors.length; i++) {
        cx = neighbors[i][0];
        cy = neighbors[i][1];
        A = angle * (i - 0.5);
        B = A + angle;
        blocks = !this._lightPasses(cx, cy);

        if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) {
          callback(cx, cy, r, 1);
        }

        if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) {
          return;
        }
        /* cutoff? */

      }
      /* for all cells in this ring */

    }
    /* for all rings */

  }
  /**
   * @param {int} A start angle
   * @param {int} B end angle
   * @param {bool} blocks Does current cell block visibility?
   * @param {int[][]} DATA shadowed angle pairs
   */


  _visibleCoords(A, B, blocks, DATA) {
    if (A < 0) {
      let v1 = this._visibleCoords(0, B, blocks, DATA);

      let v2 = this._visibleCoords(360 + A, 360, blocks, DATA);

      return v1 || v2;
    }

    let index = 0;

    while (index < DATA.length && DATA[index] < A) {
      index++;
    }

    if (index == DATA.length) {
      /* completely new shadow */
      if (blocks) {
        DATA.push(A, B);
      }

      return true;
    }

    let count = 0;

    if (index % 2) {
      /* this shadow starts in an existing shadow, or within its ending boundary */
      while (index < DATA.length && DATA[index] < B) {
        index++;
        count++;
      }

      if (count == 0) {
        return false;
      }

      if (blocks) {
        if (count % 2) {
          DATA.splice(index - count, count, B);
        } else {
          DATA.splice(index - count, count);
        }
      }

      return true;
    } else {
      /* this shadow starts outside an existing shadow, or within a starting boundary */
      while (index < DATA.length && DATA[index] < B) {
        index++;
        count++;
      }
      /* visible when outside an existing shadow, or when overlapping */


      if (A == DATA[index - count] && count == 1) {
        return false;
      }

      if (blocks) {
        if (count % 2) {
          DATA.splice(index - count, count, A);
        } else {
          DATA.splice(index - count, count, A, B);
        }
      }

      return true;
    }
  }

}

exports.default = DiscreteShadowcasting;
},{"./fov.js":"../node_modules/rot-js/lib/fov/fov.js"}],"../node_modules/rot-js/lib/fov/precise-shadowcasting.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fov = _interopRequireDefault(require("./fov.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
class PreciseShadowcasting extends _fov.default {
  compute(x, y, R, callback) {
    /* this place is always visible */
    callback(x, y, 0, 1);
    /* standing in a dark place. FIXME is this a good idea?  */

    if (!this._lightPasses(x, y)) {
      return;
    }
    /* list of all shadows */


    let SHADOWS = [];
    let cx, cy, blocks, A1, A2, visibility;
    /* analyze surrounding cells in concentric rings, starting from the center */

    for (let r = 1; r <= R; r++) {
      let neighbors = this._getCircle(x, y, r);

      let neighborCount = neighbors.length;

      for (let i = 0; i < neighborCount; i++) {
        cx = neighbors[i][0];
        cy = neighbors[i][1];
        /* shift half-an-angle backwards to maintain consistency of 0-th cells */

        A1 = [i ? 2 * i - 1 : 2 * neighborCount - 1, 2 * neighborCount];
        A2 = [2 * i + 1, 2 * neighborCount];
        blocks = !this._lightPasses(cx, cy);
        visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);

        if (visibility) {
          callback(cx, cy, r, visibility);
        }

        if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) {
          return;
        }
        /* cutoff? */

      }
      /* for all cells in this ring */

    }
    /* for all rings */

  }
  /**
   * @param {int[2]} A1 arc start
   * @param {int[2]} A2 arc end
   * @param {bool} blocks Does current arc block visibility?
   * @param {int[][]} SHADOWS list of active shadows
   */


  _checkVisibility(A1, A2, blocks, SHADOWS) {
    if (A1[0] > A2[0]) {
      /* split into two sub-arcs */
      let v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);

      let v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);

      return (v1 + v2) / 2;
    }
    /* index1: first shadow >= A1 */


    let index1 = 0,
        edge1 = false;

    while (index1 < SHADOWS.length) {
      let old = SHADOWS[index1];
      let diff = old[0] * A1[1] - A1[0] * old[1];

      if (diff >= 0) {
        /* old >= A1 */
        if (diff == 0 && !(index1 % 2)) {
          edge1 = true;
        }

        break;
      }

      index1++;
    }
    /* index2: last shadow <= A2 */


    let index2 = SHADOWS.length,
        edge2 = false;

    while (index2--) {
      let old = SHADOWS[index2];
      let diff = A2[0] * old[1] - old[0] * A2[1];

      if (diff >= 0) {
        /* old <= A2 */
        if (diff == 0 && index2 % 2) {
          edge2 = true;
        }

        break;
      }
    }

    let visible = true;

    if (index1 == index2 && (edge1 || edge2)) {
      /* subset of existing shadow, one of the edges match */
      visible = false;
    } else if (edge1 && edge2 && index1 + 1 == index2 && index2 % 2) {
      /* completely equivalent with existing shadow */
      visible = false;
    } else if (index1 > index2 && index1 % 2) {
      /* subset of existing shadow, not touching */
      visible = false;
    }

    if (!visible) {
      return 0;
    }
    /* fast case: not visible */


    let visibleLength;
    /* compute the length of visible arc, adjust list of shadows (if blocking) */

    let remove = index2 - index1 + 1;

    if (remove % 2) {
      if (index1 % 2) {
        /* first edge within existing shadow, second outside */
        let P = SHADOWS[index1];
        visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);

        if (blocks) {
          SHADOWS.splice(index1, remove, A2);
        }
      } else {
        /* second edge within existing shadow, first outside */
        let P = SHADOWS[index2];
        visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);

        if (blocks) {
          SHADOWS.splice(index1, remove, A1);
        }
      }
    } else {
      if (index1 % 2) {
        /* both edges within existing shadows */
        let P1 = SHADOWS[index1];
        let P2 = SHADOWS[index2];
        visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);

        if (blocks) {
          SHADOWS.splice(index1, remove);
        }
      } else {
        /* both edges outside existing shadows */
        if (blocks) {
          SHADOWS.splice(index1, remove, A1, A2);
        }

        return 1;
        /* whole arc visible! */
      }
    }

    let arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
    return visibleLength / arcLength;
  }

}

exports.default = PreciseShadowcasting;
},{"./fov.js":"../node_modules/rot-js/lib/fov/fov.js"}],"../node_modules/rot-js/lib/fov/recursive-shadowcasting.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fov = _interopRequireDefault(require("./fov.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Octants used for translating recursive shadowcasting offsets */
const OCTANTS = [[-1, 0, 0, 1], [0, -1, 1, 0], [0, -1, -1, 0], [-1, 0, 0, -1], [1, 0, 0, -1], [0, 1, -1, 0], [0, 1, 1, 0], [1, 0, 0, 1]];
/**
 * @class Recursive shadowcasting algorithm
 * Currently only supports 4/8 topologies, not hexagonal.
 * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 * @augments ROT.FOV
 */

class RecursiveShadowcasting extends _fov.default {
  /**
   * Compute visibility for a 360-degree circle
   * @param {int} x
   * @param {int} y
   * @param {int} R Maximum visibility radius
   * @param {function} callback
   */
  compute(x, y, R, callback) {
    //You can always see your own tile
    callback(x, y, 0, 1);

    for (let i = 0; i < OCTANTS.length; i++) {
      this._renderOctant(x, y, OCTANTS[i], R, callback);
    }
  }
  /**
   * Compute visibility for a 180-degree arc
   * @param {int} x
   * @param {int} y
   * @param {int} R Maximum visibility radius
   * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
   * @param {function} callback
   */


  compute180(x, y, R, dir, callback) {
    //You can always see your own tile
    callback(x, y, 0, 1);
    let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees

    let nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees

    let nextOctant = (dir + 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees

    this._renderOctant(x, y, OCTANTS[nextPreviousOctant], R, callback);

    this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);

    this._renderOctant(x, y, OCTANTS[dir], R, callback);

    this._renderOctant(x, y, OCTANTS[nextOctant], R, callback);
  }

  /**
   * Compute visibility for a 90-degree arc
   * @param {int} x
   * @param {int} y
   * @param {int} R Maximum visibility radius
   * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
   * @param {function} callback
   */
  compute90(x, y, R, dir, callback) {
    //You can always see your own tile
    callback(x, y, 0, 1);
    let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees

    this._renderOctant(x, y, OCTANTS[dir], R, callback);

    this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
  }
  /**
   * Render one octant (45-degree arc) of the viewshed
   * @param {int} x
   * @param {int} y
   * @param {int} octant Octant to be rendered
   * @param {int} R Maximum visibility radius
   * @param {function} callback
   */


  _renderOctant(x, y, octant, R, callback) {
    //Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
    this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
  }
  /**
   * Actually calculates the visibility
   * @param {int} startX The starting X coordinate
   * @param {int} startY The starting Y coordinate
   * @param {int} row The row to render
   * @param {float} visSlopeStart The slope to start at
   * @param {float} visSlopeEnd The slope to end at
   * @param {int} radius The radius to reach out to
   * @param {int} xx
   * @param {int} xy
   * @param {int} yx
   * @param {int} yy
   * @param {function} callback The callback to use when we hit a block that is visible
   */


  _castVisibility(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
    if (visSlopeStart < visSlopeEnd) {
      return;
    }

    for (let i = row; i <= radius; i++) {
      let dx = -i - 1;
      let dy = -i;
      let blocked = false;
      let newStart = 0; //'Row' could be column, names here assume octant 0 and would be flipped for half the octants

      while (dx <= 0) {
        dx += 1; //Translate from relative coordinates to map coordinates

        let mapX = startX + dx * xx + dy * xy;
        let mapY = startY + dx * yx + dy * yy; //Range of the row

        let slopeStart = (dx - 0.5) / (dy + 0.5);
        let slopeEnd = (dx + 0.5) / (dy - 0.5); //Ignore if not yet at left edge of Octant

        if (slopeEnd > visSlopeStart) {
          continue;
        } //Done if past right edge


        if (slopeStart < visSlopeEnd) {
          break;
        } //If it's in range, it's visible


        if (dx * dx + dy * dy < radius * radius) {
          callback(mapX, mapY, i, 1);
        }

        if (!blocked) {
          //If tile is a blocking tile, cast around it
          if (!this._lightPasses(mapX, mapY) && i < radius) {
            blocked = true;

            this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);

            newStart = slopeEnd;
          }
        } else {
          //Keep narrowing if scanning across a block
          if (!this._lightPasses(mapX, mapY)) {
            newStart = slopeEnd;
            continue;
          } //Block has ended


          blocked = false;
          visSlopeStart = newStart;
        }
      }

      if (blocked) {
        break;
      }
    }
  }

}

exports.default = RecursiveShadowcasting;
},{"./fov.js":"../node_modules/rot-js/lib/fov/fov.js"}],"../node_modules/rot-js/lib/fov/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _discreteShadowcasting = _interopRequireDefault(require("./discrete-shadowcasting.js"));

var _preciseShadowcasting = _interopRequireDefault(require("./precise-shadowcasting.js"));

var _recursiveShadowcasting = _interopRequireDefault(require("./recursive-shadowcasting.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  DiscreteShadowcasting: _discreteShadowcasting.default,
  PreciseShadowcasting: _preciseShadowcasting.default,
  RecursiveShadowcasting: _recursiveShadowcasting.default
};
exports.default = _default;
},{"./discrete-shadowcasting.js":"../node_modules/rot-js/lib/fov/discrete-shadowcasting.js","./precise-shadowcasting.js":"../node_modules/rot-js/lib/fov/precise-shadowcasting.js","./recursive-shadowcasting.js":"../node_modules/rot-js/lib/fov/recursive-shadowcasting.js"}],"../node_modules/rot-js/lib/map/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants.js");

;

class Map {
  /**
   * @class Base map generator
   * @param {int} [width=ROT.DEFAULT_WIDTH]
   * @param {int} [height=ROT.DEFAULT_HEIGHT]
   */
  constructor(width = _constants.DEFAULT_WIDTH, height = _constants.DEFAULT_HEIGHT) {
    this._width = width;
    this._height = height;
  }

  _fillMap(value) {
    let map = [];

    for (let i = 0; i < this._width; i++) {
      map.push([]);

      for (let j = 0; j < this._height; j++) {
        map[i].push(value);
      }
    }

    return map;
  }

}

exports.default = Map;
},{"../constants.js":"../node_modules/rot-js/lib/constants.js"}],"../node_modules/rot-js/lib/map/arena.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("./map.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
class Arena extends _map.default {
  create(callback) {
    let w = this._width - 1;
    let h = this._height - 1;

    for (let i = 0; i <= w; i++) {
      for (let j = 0; j <= h; j++) {
        let empty = i && j && i < w && j < h;
        callback(i, j, empty ? 0 : 1);
      }
    }

    return this;
  }

}

exports.default = Arena;
},{"./map.js":"../node_modules/rot-js/lib/map/map.js"}],"../node_modules/rot-js/lib/map/dungeon.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("./map.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
class Dungeon extends _map.default {
  constructor(width, height) {
    super(width, height);
    this._rooms = [];
    this._corridors = [];
  }
  /**
   * Get all generated rooms
   * @returns {ROT.Map.Feature.Room[]}
   */


  getRooms() {
    return this._rooms;
  }
  /**
   * Get all generated corridors
   * @returns {ROT.Map.Feature.Corridor[]}
   */


  getCorridors() {
    return this._corridors;
  }

}

exports.default = Dungeon;
},{"./map.js":"../node_modules/rot-js/lib/map/map.js"}],"../node_modules/rot-js/lib/map/features.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Corridor = exports.Room = void 0;

var _rng = _interopRequireDefault(require("../rng.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
/**
 * @class Dungeon feature; has own .create() method
 */

class Feature {}
/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */


class Room extends Feature {
  constructor(x1, y1, x2, y2, doorX, doorY) {
    super();
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    this._doors = {};

    if (doorX !== undefined && doorY !== undefined) {
      this.addDoor(doorX, doorY);
    }
  }

  /**
   * Room of random size, with a given doors and direction
   */
  static createRandomAt(x, y, dx, dy, options) {
    let min = options.roomWidth[0];
    let max = options.roomWidth[1];

    let width = _rng.default.getUniformInt(min, max);

    min = options.roomHeight[0];
    max = options.roomHeight[1];

    let height = _rng.default.getUniformInt(min, max);

    if (dx == 1) {
      /* to the right */
      let y2 = y - Math.floor(_rng.default.getUniform() * height);
      return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
    }

    if (dx == -1) {
      /* to the left */
      let y2 = y - Math.floor(_rng.default.getUniform() * height);
      return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
    }

    if (dy == 1) {
      /* to the bottom */
      let x2 = x - Math.floor(_rng.default.getUniform() * width);
      return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
    }

    if (dy == -1) {
      /* to the top */
      let x2 = x - Math.floor(_rng.default.getUniform() * width);
      return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
    }

    throw new Error("dx or dy must be 1 or -1");
  }
  /**
   * Room of random size, positioned around center coords
   */


  static createRandomCenter(cx, cy, options) {
    let min = options.roomWidth[0];
    let max = options.roomWidth[1];

    let width = _rng.default.getUniformInt(min, max);

    min = options.roomHeight[0];
    max = options.roomHeight[1];

    let height = _rng.default.getUniformInt(min, max);

    let x1 = cx - Math.floor(_rng.default.getUniform() * width);
    let y1 = cy - Math.floor(_rng.default.getUniform() * height);
    let x2 = x1 + width - 1;
    let y2 = y1 + height - 1;
    return new this(x1, y1, x2, y2);
  }
  /**
   * Room of random size within a given dimensions
   */


  static createRandom(availWidth, availHeight, options) {
    let min = options.roomWidth[0];
    let max = options.roomWidth[1];

    let width = _rng.default.getUniformInt(min, max);

    min = options.roomHeight[0];
    max = options.roomHeight[1];

    let height = _rng.default.getUniformInt(min, max);

    let left = availWidth - width - 1;
    let top = availHeight - height - 1;
    let x1 = 1 + Math.floor(_rng.default.getUniform() * left);
    let y1 = 1 + Math.floor(_rng.default.getUniform() * top);
    let x2 = x1 + width - 1;
    let y2 = y1 + height - 1;
    return new this(x1, y1, x2, y2);
  }

  addDoor(x, y) {
    this._doors[x + "," + y] = 1;
    return this;
  }
  /**
   * @param {function}
   */


  getDoors(cb) {
    for (let key in this._doors) {
      let parts = key.split(",");
      cb(parseInt(parts[0]), parseInt(parts[1]));
    }

    return this;
  }

  clearDoors() {
    this._doors = {};
    return this;
  }

  addDoors(isWallCallback) {
    let left = this._x1 - 1;
    let right = this._x2 + 1;
    let top = this._y1 - 1;
    let bottom = this._y2 + 1;

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        if (x != left && x != right && y != top && y != bottom) {
          continue;
        }

        if (isWallCallback(x, y)) {
          continue;
        }

        this.addDoor(x, y);
      }
    }

    return this;
  }

  debug() {
    console.log("room", this._x1, this._y1, this._x2, this._y2);
  }

  isValid(isWallCallback, canBeDugCallback) {
    let left = this._x1 - 1;
    let right = this._x2 + 1;
    let top = this._y1 - 1;
    let bottom = this._y2 + 1;

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        if (x == left || x == right || y == top || y == bottom) {
          if (!isWallCallback(x, y)) {
            return false;
          }
        } else {
          if (!canBeDugCallback(x, y)) {
            return false;
          }
        }
      }
    }

    return true;
  }
  /**
   * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
   */


  create(digCallback) {
    let left = this._x1 - 1;
    let right = this._x2 + 1;
    let top = this._y1 - 1;
    let bottom = this._y2 + 1;
    let value = 0;

    for (let x = left; x <= right; x++) {
      for (let y = top; y <= bottom; y++) {
        if (x + "," + y in this._doors) {
          value = 2;
        } else if (x == left || x == right || y == top || y == bottom) {
          value = 1;
        } else {
          value = 0;
        }

        digCallback(x, y, value);
      }
    }
  }

  getCenter() {
    return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
  }

  getLeft() {
    return this._x1;
  }

  getRight() {
    return this._x2;
  }

  getTop() {
    return this._y1;
  }

  getBottom() {
    return this._y2;
  }

}
/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */


exports.Room = Room;

class Corridor extends Feature {
  constructor(startX, startY, endX, endY) {
    super();
    this._startX = startX;
    this._startY = startY;
    this._endX = endX;
    this._endY = endY;
    this._endsWithAWall = true;
  }

  static createRandomAt(x, y, dx, dy, options) {
    let min = options.corridorLength[0];
    let max = options.corridorLength[1];

    let length = _rng.default.getUniformInt(min, max);

    return new this(x, y, x + dx * length, y + dy * length);
  }

  debug() {
    console.log("corridor", this._startX, this._startY, this._endX, this._endY);
  }

  isValid(isWallCallback, canBeDugCallback) {
    let sx = this._startX;
    let sy = this._startY;
    let dx = this._endX - sx;
    let dy = this._endY - sy;
    let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

    if (dx) {
      dx = dx / Math.abs(dx);
    }

    if (dy) {
      dy = dy / Math.abs(dy);
    }

    let nx = dy;
    let ny = -dx;
    let ok = true;

    for (let i = 0; i < length; i++) {
      let x = sx + i * dx;
      let y = sy + i * dy;

      if (!canBeDugCallback(x, y)) {
        ok = false;
      }

      if (!isWallCallback(x + nx, y + ny)) {
        ok = false;
      }

      if (!isWallCallback(x - nx, y - ny)) {
        ok = false;
      }

      if (!ok) {
        length = i;
        this._endX = x - dx;
        this._endY = y - dy;
        break;
      }
    }
    /**
     * If the length degenerated, this corridor might be invalid
     */

    /* not supported */


    if (length == 0) {
      return false;
    }
    /* length 1 allowed only if the next space is empty */


    if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
      return false;
    }
    /**
     * We do not want the corridor to crash into a corner of a room;
     * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
     *
     * Situation:
     * #######1
     * .......?
     * #######2
     *
     * The corridor was dug from left to right.
     * 1, 2 - problematic corners, ? = N+1th cell (not dug)
     */


    let firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
    let secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
    this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);

    if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
      return false;
    }

    return true;
  }
  /**
   * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
   */


  create(digCallback) {
    let sx = this._startX;
    let sy = this._startY;
    let dx = this._endX - sx;
    let dy = this._endY - sy;
    let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));

    if (dx) {
      dx = dx / Math.abs(dx);
    }

    if (dy) {
      dy = dy / Math.abs(dy);
    }

    for (let i = 0; i < length; i++) {
      let x = sx + i * dx;
      let y = sy + i * dy;
      digCallback(x, y, 0);
    }

    return true;
  }

  createPriorityWalls(priorityWallCallback) {
    if (!this._endsWithAWall) {
      return;
    }

    let sx = this._startX;
    let sy = this._startY;
    let dx = this._endX - sx;
    let dy = this._endY - sy;

    if (dx) {
      dx = dx / Math.abs(dx);
    }

    if (dy) {
      dy = dy / Math.abs(dy);
    }

    let nx = dy;
    let ny = -dx;
    priorityWallCallback(this._endX + dx, this._endY + dy);
    priorityWallCallback(this._endX + nx, this._endY + ny);
    priorityWallCallback(this._endX - nx, this._endY - ny);
  }

}

exports.Corridor = Corridor;
},{"../rng.js":"../node_modules/rot-js/lib/rng.js"}],"../node_modules/rot-js/lib/map/uniform.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dungeon = _interopRequireDefault(require("./dungeon.js"));

var _features = require("./features.js");

var _rng = _interopRequireDefault(require("../rng.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */

class Uniform extends _dungeon.default {
  constructor(width, height, options) {
    super(width, height);
    this._options = {
      roomWidth: [3, 9],
      roomHeight: [3, 5],
      roomDugPercentage: 0.1,
      timeLimit: 1000
      /* we stop after this much time has passed (msec) */

    };
    Object.assign(this._options, options);
    this._map = [];
    this._dug = 0;
    this._roomAttempts = 20;
    /* new room is created N-times until is considered as impossible to generate */

    this._corridorAttempts = 20;
    /* corridors are tried N-times until the level is considered as impossible to connect */

    this._connected = [];
    /* list of already connected rooms */

    this._unconnected = [];
    /* list of remaining unconnected rooms */

    this._digCallback = this._digCallback.bind(this);
    this._canBeDugCallback = this._canBeDugCallback.bind(this);
    this._isWallCallback = this._isWallCallback.bind(this);
  }
  /**
   * Create a map. If the time limit has been hit, returns null.
   * @see ROT.Map#create
   */


  create(callback) {
    let t1 = Date.now();

    while (1) {
      let t2 = Date.now();

      if (t2 - t1 > this._options.timeLimit) {
        return null;
      }
      /* time limit! */


      this._map = this._fillMap(1);
      this._dug = 0;
      this._rooms = [];
      this._unconnected = [];

      this._generateRooms();

      if (this._rooms.length < 2) {
        continue;
      }

      if (this._generateCorridors()) {
        break;
      }
    }

    if (callback) {
      for (let i = 0; i < this._width; i++) {
        for (let j = 0; j < this._height; j++) {
          callback(i, j, this._map[i][j]);
        }
      }
    }

    return this;
  }
  /**
   * Generates a suitable amount of rooms
   */


  _generateRooms() {
    let w = this._width - 2;
    let h = this._height - 2;
    let room;

    do {
      room = this._generateRoom();

      if (this._dug / (w * h) > this._options.roomDugPercentage) {
        break;
      }
      /* achieved requested amount of free space */

    } while (room);
    /* either enough rooms, or not able to generate more of them :) */

  }
  /**
   * Try to generate one room
   */


  _generateRoom() {
    let count = 0;

    while (count < this._roomAttempts) {
      count++;

      let room = _features.Room.createRandom(this._width, this._height, this._options);

      if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
        continue;
      }

      room.create(this._digCallback);

      this._rooms.push(room);

      return room;
    }
    /* no room was generated in a given number of attempts */


    return null;
  }
  /**
   * Generates connectors beween rooms
   * @returns {bool} success Was this attempt successfull?
   */


  _generateCorridors() {
    let cnt = 0;

    while (cnt < this._corridorAttempts) {
      cnt++;
      this._corridors = [];
      /* dig rooms into a clear map */

      this._map = this._fillMap(1);

      for (let i = 0; i < this._rooms.length; i++) {
        let room = this._rooms[i];
        room.clearDoors();
        room.create(this._digCallback);
      }

      this._unconnected = _rng.default.shuffle(this._rooms.slice());
      this._connected = [];

      if (this._unconnected.length) {
        this._connected.push(this._unconnected.pop());
      }
      /* first one is always connected */


      while (1) {
        /* 1. pick random connected room */
        let connected = _rng.default.getItem(this._connected);

        if (!connected) {
          break;
        }
        /* 2. find closest unconnected */


        let room1 = this._closestRoom(this._unconnected, connected);

        if (!room1) {
          break;
        }
        /* 3. connect it to closest connected */


        let room2 = this._closestRoom(this._connected, room1);

        if (!room2) {
          break;
        }

        let ok = this._connectRooms(room1, room2);

        if (!ok) {
          break;
        }
        /* stop connecting, re-shuffle */


        if (!this._unconnected.length) {
          return true;
        }
        /* done; no rooms remain */

      }
    }

    return false;
  }

  /**
   * For a given room, find the closest one from the list
   */
  _closestRoom(rooms, room) {
    let dist = Infinity;
    let center = room.getCenter();
    let result = null;

    for (let i = 0; i < rooms.length; i++) {
      let r = rooms[i];
      let c = r.getCenter();
      let dx = c[0] - center[0];
      let dy = c[1] - center[1];
      let d = dx * dx + dy * dy;

      if (d < dist) {
        dist = d;
        result = r;
      }
    }

    return result;
  }

  _connectRooms(room1, room2) {
    /*
        room1.debug();
        room2.debug();
    */
    let center1 = room1.getCenter();
    let center2 = room2.getCenter();
    let diffX = center2[0] - center1[0];
    let diffY = center2[1] - center1[1];
    let start;
    let end;
    let dirIndex1, dirIndex2, min, max, index;

    if (Math.abs(diffX) < Math.abs(diffY)) {
      /* first try connecting north-south walls */
      dirIndex1 = diffY > 0 ? 2 : 0;
      dirIndex2 = (dirIndex1 + 2) % 4;
      min = room2.getLeft();
      max = room2.getRight();
      index = 0;
    } else {
      /* first try connecting east-west walls */
      dirIndex1 = diffX > 0 ? 1 : 3;
      dirIndex2 = (dirIndex1 + 2) % 4;
      min = room2.getTop();
      max = room2.getBottom();
      index = 1;
    }

    start = this._placeInWall(room1, dirIndex1);
    /* corridor will start here */

    if (!start) {
      return false;
    }

    if (start[index] >= min && start[index] <= max) {
      /* possible to connect with straight line (I-like) */
      end = start.slice();
      let value = 0;

      switch (dirIndex2) {
        case 0:
          value = room2.getTop() - 1;
          break;

        case 1:
          value = room2.getRight() + 1;
          break;

        case 2:
          value = room2.getBottom() + 1;
          break;

        case 3:
          value = room2.getLeft() - 1;
          break;
      }

      end[(index + 1) % 2] = value;

      this._digLine([start, end]);
    } else if (start[index] < min - 1 || start[index] > max + 1) {
      /* need to switch target wall (L-like) */
      let diff = start[index] - center2[index];
      let rotation = 0;

      switch (dirIndex2) {
        case 0:
        case 1:
          rotation = diff < 0 ? 3 : 1;
          break;

        case 2:
        case 3:
          rotation = diff < 0 ? 1 : 3;
          break;
      }

      dirIndex2 = (dirIndex2 + rotation) % 4;
      end = this._placeInWall(room2, dirIndex2);

      if (!end) {
        return false;
      }

      let mid = [0, 0];
      mid[index] = start[index];
      let index2 = (index + 1) % 2;
      mid[index2] = end[index2];

      this._digLine([start, mid, end]);
    } else {
      /* use current wall pair, but adjust the line in the middle (S-like) */
      let index2 = (index + 1) % 2;
      end = this._placeInWall(room2, dirIndex2);

      if (!end) {
        return false;
      }

      let mid = Math.round((end[index2] + start[index2]) / 2);
      let mid1 = [0, 0];
      let mid2 = [0, 0];
      mid1[index] = start[index];
      mid1[index2] = mid;
      mid2[index] = end[index];
      mid2[index2] = mid;

      this._digLine([start, mid1, mid2, end]);
    }

    room1.addDoor(start[0], start[1]);
    room2.addDoor(end[0], end[1]);
    index = this._unconnected.indexOf(room1);

    if (index != -1) {
      this._unconnected.splice(index, 1);

      this._connected.push(room1);
    }

    index = this._unconnected.indexOf(room2);

    if (index != -1) {
      this._unconnected.splice(index, 1);

      this._connected.push(room2);
    }

    return true;
  }

  _placeInWall(room, dirIndex) {
    let start = [0, 0];
    let dir = [0, 0];
    let length = 0;

    switch (dirIndex) {
      case 0:
        dir = [1, 0];
        start = [room.getLeft(), room.getTop() - 1];
        length = room.getRight() - room.getLeft() + 1;
        break;

      case 1:
        dir = [0, 1];
        start = [room.getRight() + 1, room.getTop()];
        length = room.getBottom() - room.getTop() + 1;
        break;

      case 2:
        dir = [1, 0];
        start = [room.getLeft(), room.getBottom() + 1];
        length = room.getRight() - room.getLeft() + 1;
        break;

      case 3:
        dir = [0, 1];
        start = [room.getLeft() - 1, room.getTop()];
        length = room.getBottom() - room.getTop() + 1;
        break;
    }

    let avail = [];
    let lastBadIndex = -2;

    for (let i = 0; i < length; i++) {
      let x = start[0] + i * dir[0];
      let y = start[1] + i * dir[1];
      avail.push(null);
      let isWall = this._map[x][y] == 1;

      if (isWall) {
        if (lastBadIndex != i - 1) {
          avail[i] = [x, y];
        }
      } else {
        lastBadIndex = i;

        if (i) {
          avail[i - 1] = null;
        }
      }
    }

    for (let i = avail.length - 1; i >= 0; i--) {
      if (!avail[i]) {
        avail.splice(i, 1);
      }
    }

    return avail.length ? _rng.default.getItem(avail) : null;
  }
  /**
   * Dig a polyline.
   */


  _digLine(points) {
    for (let i = 1; i < points.length; i++) {
      let start = points[i - 1];
      let end = points[i];
      let corridor = new _features.Corridor(start[0], start[1], end[0], end[1]);
      corridor.create(this._digCallback);

      this._corridors.push(corridor);
    }
  }

  _digCallback(x, y, value) {
    this._map[x][y] = value;

    if (value == 0) {
      this._dug++;
    }
  }

  _isWallCallback(x, y) {
    if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
      return false;
    }

    return this._map[x][y] == 1;
  }

  _canBeDugCallback(x, y) {
    if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
      return false;
    }

    return this._map[x][y] == 1;
  }

}

exports.default = Uniform;
},{"./dungeon.js":"../node_modules/rot-js/lib/map/dungeon.js","./features.js":"../node_modules/rot-js/lib/map/features.js","../rng.js":"../node_modules/rot-js/lib/rng.js"}],"../node_modules/rot-js/lib/map/cellular.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("./map.js"));

var _constants = require("../constants.js");

var _rng = _interopRequireDefault(require("../rng.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */

class Cellular extends _map.default {
  constructor(width, height, options = {}) {
    super(width, height);
    this._options = {
      born: [5, 6, 7, 8],
      survive: [4, 5, 6, 7, 8],
      topology: 8
    };
    this.setOptions(options);
    this._dirs = _constants.DIRS[this._options.topology];
    this._map = this._fillMap(0);
  }
  /**
   * Fill the map with random values
   * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
   */


  randomize(probability) {
    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        this._map[i][j] = _rng.default.getUniform() < probability ? 1 : 0;
      }
    }

    return this;
  }
  /**
   * Change options.
   * @see ROT.Map.Cellular
   */


  setOptions(options) {
    Object.assign(this._options, options);
  }

  set(x, y, value) {
    this._map[x][y] = value;
  }

  create(callback) {
    let newMap = this._fillMap(0);

    let born = this._options.born;
    let survive = this._options.survive;

    for (let j = 0; j < this._height; j++) {
      let widthStep = 1;
      let widthStart = 0;

      if (this._options.topology == 6) {
        widthStep = 2;
        widthStart = j % 2;
      }

      for (let i = widthStart; i < this._width; i += widthStep) {
        let cur = this._map[i][j];

        let ncount = this._getNeighbors(i, j);

        if (cur && survive.indexOf(ncount) != -1) {
          /* survive */
          newMap[i][j] = 1;
        } else if (!cur && born.indexOf(ncount) != -1) {
          /* born */
          newMap[i][j] = 1;
        }
      }
    }

    this._map = newMap;
    callback && this._serviceCallback(callback);
  }

  _serviceCallback(callback) {
    for (let j = 0; j < this._height; j++) {
      let widthStep = 1;
      let widthStart = 0;

      if (this._options.topology == 6) {
        widthStep = 2;
        widthStart = j % 2;
      }

      for (let i = widthStart; i < this._width; i += widthStep) {
        callback(i, j, this._map[i][j]);
      }
    }
  }
  /**
   * Get neighbor count at [i,j] in this._map
   */


  _getNeighbors(cx, cy) {
    let result = 0;

    for (let i = 0; i < this._dirs.length; i++) {
      let dir = this._dirs[i];
      let x = cx + dir[0];
      let y = cy + dir[1];

      if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        continue;
      }

      result += this._map[x][y] == 1 ? 1 : 0;
    }

    return result;
  }
  /**
   * Make sure every non-wall space is accessible.
   * @param {function} callback to call to display map when do
   * @param {int} value to consider empty space - defaults to 0
   * @param {function} callback to call when a new connection is made
   */


  connect(callback, value, connectionCallback) {
    if (!value) value = 0;
    let allFreeSpace = [];
    let notConnected = {}; // find all free space

    let widthStep = 1;
    let widthStarts = [0, 0];

    if (this._options.topology == 6) {
      widthStep = 2;
      widthStarts = [0, 1];
    }

    for (let y = 0; y < this._height; y++) {
      for (let x = widthStarts[y % 2]; x < this._width; x += widthStep) {
        if (this._freeSpace(x, y, value)) {
          let p = [x, y];
          notConnected[this._pointKey(p)] = p;
          allFreeSpace.push([x, y]);
        }
      }
    }

    let start = allFreeSpace[_rng.default.getUniformInt(0, allFreeSpace.length - 1)];

    let key = this._pointKey(start);

    let connected = {};
    connected[key] = start;
    delete notConnected[key]; // find what's connected to the starting point

    this._findConnected(connected, notConnected, [start], false, value);

    while (Object.keys(notConnected).length > 0) {
      // find two points from notConnected to connected
      let p = this._getFromTo(connected, notConnected);

      let from = p[0]; // notConnected

      let to = p[1]; // connected
      // find everything connected to the starting point

      let local = {};
      local[this._pointKey(from)] = from;

      this._findConnected(local, notConnected, [from], true, value); // connect to a connected cell


      let tunnelFn = this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected;
      tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback); // now all of local is connected

      for (let k in local) {
        let pp = local[k];
        this._map[pp[0]][pp[1]] = value;
        connected[k] = pp;
        delete notConnected[k];
      }
    }

    callback && this._serviceCallback(callback);
  }
  /**
   * Find random points to connect. Search for the closest point in the larger space.
   * This is to minimize the length of the passage while maintaining good performance.
   */


  _getFromTo(connected, notConnected) {
    let from = [0, 0],
        to = [0, 0],
        d;
    let connectedKeys = Object.keys(connected);
    let notConnectedKeys = Object.keys(notConnected);

    for (let i = 0; i < 5; i++) {
      if (connectedKeys.length < notConnectedKeys.length) {
        let keys = connectedKeys;
        to = connected[keys[_rng.default.getUniformInt(0, keys.length - 1)]];
        from = this._getClosest(to, notConnected);
      } else {
        let keys = notConnectedKeys;
        from = notConnected[keys[_rng.default.getUniformInt(0, keys.length - 1)]];
        to = this._getClosest(from, connected);
      }

      d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);

      if (d < 64) {
        break;
      }
    } // console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);


    return [from, to];
  }

  _getClosest(point, space) {
    let minPoint = null;
    let minDist = null;

    for (let k in space) {
      let p = space[k];
      let d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);

      if (minDist == null || d < minDist) {
        minDist = d;
        minPoint = p;
      }
    }

    return minPoint;
  }

  _findConnected(connected, notConnected, stack, keepNotConnected, value) {
    while (stack.length > 0) {
      let p = stack.splice(0, 1)[0];
      let tests;

      if (this._options.topology == 6) {
        tests = [[p[0] + 2, p[1]], [p[0] + 1, p[1] - 1], [p[0] - 1, p[1] - 1], [p[0] - 2, p[1]], [p[0] - 1, p[1] + 1], [p[0] + 1, p[1] + 1]];
      } else {
        tests = [[p[0] + 1, p[1]], [p[0] - 1, p[1]], [p[0], p[1] + 1], [p[0], p[1] - 1]];
      }

      for (let i = 0; i < tests.length; i++) {
        let key = this._pointKey(tests[i]);

        if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
          connected[key] = tests[i];

          if (!keepNotConnected) {
            delete notConnected[key];
          }

          stack.push(tests[i]);
        }
      }
    }
  }

  _tunnelToConnected(to, from, connected, notConnected, value, connectionCallback) {
    let a, b;

    if (from[0] < to[0]) {
      a = from;
      b = to;
    } else {
      a = to;
      b = from;
    }

    for (let xx = a[0]; xx <= b[0]; xx++) {
      this._map[xx][a[1]] = value;
      let p = [xx, a[1]];

      let pkey = this._pointKey(p);

      connected[pkey] = p;
      delete notConnected[pkey];
    }

    if (connectionCallback && a[0] < b[0]) {
      connectionCallback(a, [b[0], a[1]]);
    } // x is now fixed


    let x = b[0];

    if (from[1] < to[1]) {
      a = from;
      b = to;
    } else {
      a = to;
      b = from;
    }

    for (let yy = a[1]; yy < b[1]; yy++) {
      this._map[x][yy] = value;
      let p = [x, yy];

      let pkey = this._pointKey(p);

      connected[pkey] = p;
      delete notConnected[pkey];
    }

    if (connectionCallback && a[1] < b[1]) {
      connectionCallback([b[0], a[1]], [b[0], b[1]]);
    }
  }

  _tunnelToConnected6(to, from, connected, notConnected, value, connectionCallback) {
    let a, b;

    if (from[0] < to[0]) {
      a = from;
      b = to;
    } else {
      a = to;
      b = from;
    } // tunnel diagonally until horizontally level


    let xx = a[0];
    let yy = a[1];

    while (!(xx == b[0] && yy == b[1])) {
      let stepWidth = 2;

      if (yy < b[1]) {
        yy++;
        stepWidth = 1;
      } else if (yy > b[1]) {
        yy--;
        stepWidth = 1;
      }

      if (xx < b[0]) {
        xx += stepWidth;
      } else if (xx > b[0]) {
        xx -= stepWidth;
      } else if (b[1] % 2) {
        // Won't step outside map if destination on is map's right edge
        xx -= stepWidth;
      } else {
        // ditto for left edge
        xx += stepWidth;
      }

      this._map[xx][yy] = value;
      let p = [xx, yy];

      let pkey = this._pointKey(p);

      connected[pkey] = p;
      delete notConnected[pkey];
    }

    if (connectionCallback) {
      connectionCallback(from, to);
    }
  }

  _freeSpace(x, y, value) {
    return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
  }

  _pointKey(p) {
    return p[0] + "." + p[1];
  }

}

exports.default = Cellular;
},{"./map.js":"../node_modules/rot-js/lib/map/map.js","../constants.js":"../node_modules/rot-js/lib/constants.js","../rng.js":"../node_modules/rot-js/lib/rng.js"}],"../node_modules/rot-js/lib/map/digger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dungeon = _interopRequireDefault(require("./dungeon.js"));

var _features = require("./features.js");

var _rng = _interopRequireDefault(require("../rng.js"));

var _constants = require("../constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FEATURES = {
  "room": _features.Room,
  "corridor": _features.Corridor
};
/**
 * Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 */

class Digger extends _dungeon.default {
  constructor(width, height, options = {}) {
    super(width, height);
    this._options = Object.assign({
      roomWidth: [3, 9],
      roomHeight: [3, 5],
      corridorLength: [3, 10],
      dugPercentage: 0.2,
      timeLimit: 1000
      /* we stop after this much time has passed (msec) */

    }, options);
    this._features = {
      "room": 4,
      "corridor": 4
    };
    this._map = [];
    this._featureAttempts = 20;
    /* how many times do we try to create a feature on a suitable wall */

    this._walls = {};
    /* these are available for digging */

    this._dug = 0;
    this._digCallback = this._digCallback.bind(this);
    this._canBeDugCallback = this._canBeDugCallback.bind(this);
    this._isWallCallback = this._isWallCallback.bind(this);
    this._priorityWallCallback = this._priorityWallCallback.bind(this);
  }

  create(callback) {
    this._rooms = [];
    this._corridors = [];
    this._map = this._fillMap(1);
    this._walls = {};
    this._dug = 0;
    let area = (this._width - 2) * (this._height - 2);

    this._firstRoom();

    let t1 = Date.now();
    let priorityWalls;

    do {
      priorityWalls = 0;
      let t2 = Date.now();

      if (t2 - t1 > this._options.timeLimit) {
        break;
      }
      /* find a good wall */


      let wall = this._findWall();

      if (!wall) {
        break;
      }
      /* no more walls */


      let parts = wall.split(",");
      let x = parseInt(parts[0]);
      let y = parseInt(parts[1]);

      let dir = this._getDiggingDirection(x, y);

      if (!dir) {
        continue;
      }
      /* this wall is not suitable */
      //		console.log("wall", x, y);

      /* try adding a feature */


      let featureAttempts = 0;

      do {
        featureAttempts++;

        if (this._tryFeature(x, y, dir[0], dir[1])) {
          /* feature added */
          //if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
          this._removeSurroundingWalls(x, y);

          this._removeSurroundingWalls(x - dir[0], y - dir[1]);

          break;
        }
      } while (featureAttempts < this._featureAttempts);

      for (let id in this._walls) {
        if (this._walls[id] > 1) {
          priorityWalls++;
        }
      }
    } while (this._dug / area < this._options.dugPercentage || priorityWalls);
    /* fixme number of priority walls */


    this._addDoors();

    if (callback) {
      for (let i = 0; i < this._width; i++) {
        for (let j = 0; j < this._height; j++) {
          callback(i, j, this._map[i][j]);
        }
      }
    }

    this._walls = {};
    this._map = [];
    return this;
  }

  _digCallback(x, y, value) {
    if (value == 0 || value == 2) {
      /* empty */
      this._map[x][y] = 0;
      this._dug++;
    } else {
      /* wall */
      this._walls[x + "," + y] = 1;
    }
  }

  _isWallCallback(x, y) {
    if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
      return false;
    }

    return this._map[x][y] == 1;
  }

  _canBeDugCallback(x, y) {
    if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
      return false;
    }

    return this._map[x][y] == 1;
  }

  _priorityWallCallback(x, y) {
    this._walls[x + "," + y] = 2;
  }

  _firstRoom() {
    let cx = Math.floor(this._width / 2);
    let cy = Math.floor(this._height / 2);

    let room = _features.Room.createRandomCenter(cx, cy, this._options);

    this._rooms.push(room);

    room.create(this._digCallback);
  }
  /**
   * Get a suitable wall
   */


  _findWall() {
    let prio1 = [];
    let prio2 = [];

    for (let id in this._walls) {
      let prio = this._walls[id];

      if (prio == 2) {
        prio2.push(id);
      } else {
        prio1.push(id);
      }
    }

    let arr = prio2.length ? prio2 : prio1;

    if (!arr.length) {
      return null;
    }
    /* no walls :/ */


    let id = _rng.default.getItem(arr.sort()); // sort to make the order deterministic


    delete this._walls[id];
    return id;
  }
  /**
   * Tries adding a feature
   * @returns {bool} was this a successful try?
   */


  _tryFeature(x, y, dx, dy) {
    let featureName = _rng.default.getWeightedValue(this._features);

    let ctor = FEATURES[featureName];
    let feature = ctor.createRandomAt(x, y, dx, dy, this._options);

    if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
      //		console.log("not valid");
      //		feature.debug();
      return false;
    }

    feature.create(this._digCallback); //	feature.debug();

    if (feature instanceof _features.Room) {
      this._rooms.push(feature);
    }

    if (feature instanceof _features.Corridor) {
      feature.createPriorityWalls(this._priorityWallCallback);

      this._corridors.push(feature);
    }

    return true;
  }

  _removeSurroundingWalls(cx, cy) {
    let deltas = _constants.DIRS[4];

    for (let i = 0; i < deltas.length; i++) {
      let delta = deltas[i];
      let x = cx + delta[0];
      let y = cy + delta[1];
      delete this._walls[x + "," + y];
      x = cx + 2 * delta[0];
      y = cy + 2 * delta[1];
      delete this._walls[x + "," + y];
    }
  }
  /**
   * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
   */


  _getDiggingDirection(cx, cy) {
    if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
      return null;
    }

    let result = null;
    let deltas = _constants.DIRS[4];

    for (let i = 0; i < deltas.length; i++) {
      let delta = deltas[i];
      let x = cx + delta[0];
      let y = cy + delta[1];

      if (!this._map[x][y]) {
        /* there already is another empty neighbor! */
        if (result) {
          return null;
        }

        result = delta;
      }
    }
    /* no empty neighbor */


    if (!result) {
      return null;
    }

    return [-result[0], -result[1]];
  }
  /**
   * Find empty spaces surrounding rooms, and apply doors.
   */


  _addDoors() {
    let data = this._map;

    function isWallCallback(x, y) {
      return data[x][y] == 1;
    }

    ;

    for (let i = 0; i < this._rooms.length; i++) {
      let room = this._rooms[i];
      room.clearDoors();
      room.addDoors(isWallCallback);
    }
  }

}

exports.default = Digger;
},{"./dungeon.js":"../node_modules/rot-js/lib/map/dungeon.js","./features.js":"../node_modules/rot-js/lib/map/features.js","../rng.js":"../node_modules/rot-js/lib/rng.js","../constants.js":"../node_modules/rot-js/lib/constants.js"}],"../node_modules/rot-js/lib/map/ellermaze.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("./map.js"));

var _rng = _interopRequireDefault(require("../rng.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Join lists with "i" and "i+1"
 */
function addToList(i, L, R) {
  R[L[i + 1]] = R[i];
  L[R[i]] = L[i + 1];
  R[i] = i + 1;
  L[i + 1] = i;
}
/**
 * Remove "i" from its list
 */


function removeFromList(i, L, R) {
  R[L[i]] = R[i];
  L[R[i]] = L[i];
  R[i] = i;
  L[i] = i;
}
/**
 * Maze generator - Eller's algorithm
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 */


class EllerMaze extends _map.default {
  create(callback) {
    let map = this._fillMap(1);

    let w = Math.ceil((this._width - 2) / 2);
    let rand = 9 / 24;
    let L = [];
    let R = [];

    for (let i = 0; i < w; i++) {
      L.push(i);
      R.push(i);
    }

    L.push(w - 1);
    /* fake stop-block at the right side */

    let j;

    for (j = 1; j + 3 < this._height; j += 2) {
      /* one row */
      for (let i = 0; i < w; i++) {
        /* cell coords (will be always empty) */
        let x = 2 * i + 1;
        let y = j;
        map[x][y] = 0;
        /* right connection */

        if (i != L[i + 1] && _rng.default.getUniform() > rand) {
          addToList(i, L, R);
          map[x + 1][y] = 0;
        }
        /* bottom connection */


        if (i != L[i] && _rng.default.getUniform() > rand) {
          /* remove connection */
          removeFromList(i, L, R);
        } else {
          /* create connection */
          map[x][y + 1] = 0;
        }
      }
    }
    /* last row */


    for (let i = 0; i < w; i++) {
      /* cell coords (will be always empty) */
      let x = 2 * i + 1;
      let y = j;
      map[x][y] = 0;
      /* right connection */

      if (i != L[i + 1] && (i == L[i] || _rng.default.getUniform() > rand)) {
        /* dig right also if the cell is separated, so it gets connected to the rest of maze */
        addToList(i, L, R);
        map[x + 1][y] = 0;
      }

      removeFromList(i, L, R);
    }

    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        callback(i, j, map[i][j]);
      }
    }

    return this;
  }

}

exports.default = EllerMaze;
},{"./map.js":"../node_modules/rot-js/lib/map/map.js","../rng.js":"../node_modules/rot-js/lib/rng.js"}],"../node_modules/rot-js/lib/map/dividedmaze.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("./map.js"));

var _rng = _interopRequireDefault(require("../rng.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
class DividedMaze extends _map.default {
  constructor() {
    super(...arguments);
    this._stack = [];
    this._map = [];
  }

  create(callback) {
    let w = this._width;
    let h = this._height;
    this._map = [];

    for (let i = 0; i < w; i++) {
      this._map.push([]);

      for (let j = 0; j < h; j++) {
        let border = i == 0 || j == 0 || i + 1 == w || j + 1 == h;

        this._map[i].push(border ? 1 : 0);
      }
    }

    this._stack = [[1, 1, w - 2, h - 2]];

    this._process();

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        callback(i, j, this._map[i][j]);
      }
    }

    this._map = [];
    return this;
  }

  _process() {
    while (this._stack.length) {
      let room = this._stack.shift();
      /* [left, top, right, bottom] */


      this._partitionRoom(room);
    }
  }

  _partitionRoom(room) {
    let availX = [];
    let availY = [];

    for (let i = room[0] + 1; i < room[2]; i++) {
      let top = this._map[i][room[1] - 1];
      let bottom = this._map[i][room[3] + 1];

      if (top && bottom && !(i % 2)) {
        availX.push(i);
      }
    }

    for (let j = room[1] + 1; j < room[3]; j++) {
      let left = this._map[room[0] - 1][j];
      let right = this._map[room[2] + 1][j];

      if (left && right && !(j % 2)) {
        availY.push(j);
      }
    }

    if (!availX.length || !availY.length) {
      return;
    }

    let x = _rng.default.getItem(availX);

    let y = _rng.default.getItem(availY);

    this._map[x][y] = 1;
    let walls = [];
    let w = [];
    walls.push(w);
    /* left part */

    for (let i = room[0]; i < x; i++) {
      this._map[i][y] = 1;
      w.push([i, y]);
    }

    w = [];
    walls.push(w);
    /* right part */

    for (let i = x + 1; i <= room[2]; i++) {
      this._map[i][y] = 1;
      w.push([i, y]);
    }

    w = [];
    walls.push(w);
    /* top part */

    for (let j = room[1]; j < y; j++) {
      this._map[x][j] = 1;
      w.push([x, j]);
    }

    w = [];
    walls.push(w);
    /* bottom part */

    for (let j = y + 1; j <= room[3]; j++) {
      this._map[x][j] = 1;
      w.push([x, j]);
    }

    let solid = _rng.default.getItem(walls);

    for (let i = 0; i < walls.length; i++) {
      let w = walls[i];

      if (w == solid) {
        continue;
      }

      let hole = _rng.default.getItem(w);

      this._map[hole[0]][hole[1]] = 0;
    }

    this._stack.push([room[0], room[1], x - 1, y - 1]);
    /* left top */


    this._stack.push([x + 1, room[1], room[2], y - 1]);
    /* right top */


    this._stack.push([room[0], y + 1, x - 1, room[3]]);
    /* left bottom */


    this._stack.push([x + 1, y + 1, room[2], room[3]]);
    /* right bottom */

  }

}

exports.default = DividedMaze;
},{"./map.js":"../node_modules/rot-js/lib/map/map.js","../rng.js":"../node_modules/rot-js/lib/rng.js"}],"../node_modules/rot-js/lib/map/iceymaze.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("./map.js"));

var _rng = _interopRequireDefault(require("../rng.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Icey's Maze generator
 * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
 */
class IceyMaze extends _map.default {
  constructor(width, height, regularity = 0) {
    super(width, height);
    this._regularity = regularity;
    this._map = [];
  }

  create(callback) {
    let width = this._width;
    let height = this._height;

    let map = this._fillMap(1);

    width -= width % 2 ? 1 : 2;
    height -= height % 2 ? 1 : 2;
    let cx = 0;
    let cy = 0;
    let nx = 0;
    let ny = 0;
    let done = 0;
    let blocked = false;
    let dirs = [[0, 0], [0, 0], [0, 0], [0, 0]];

    do {
      cx = 1 + 2 * Math.floor(_rng.default.getUniform() * (width - 1) / 2);
      cy = 1 + 2 * Math.floor(_rng.default.getUniform() * (height - 1) / 2);

      if (!done) {
        map[cx][cy] = 0;
      }

      if (!map[cx][cy]) {
        this._randomize(dirs);

        do {
          if (Math.floor(_rng.default.getUniform() * (this._regularity + 1)) == 0) {
            this._randomize(dirs);
          }

          blocked = true;

          for (let i = 0; i < 4; i++) {
            nx = cx + dirs[i][0] * 2;
            ny = cy + dirs[i][1] * 2;

            if (this._isFree(map, nx, ny, width, height)) {
              map[nx][ny] = 0;
              map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
              cx = nx;
              cy = ny;
              blocked = false;
              done++;
              break;
            }
          }
        } while (!blocked);
      }
    } while (done + 1 < width * height / 4);

    for (let i = 0; i < this._width; i++) {
      for (let j = 0; j < this._height; j++) {
        callback(i, j, map[i][j]);
      }
    }

    this._map = [];
    return this;
  }

  _randomize(dirs) {
    for (let i = 0; i < 4; i++) {
      dirs[i][0] = 0;
      dirs[i][1] = 0;
    }

    switch (Math.floor(_rng.default.getUniform() * 4)) {
      case 0:
        dirs[0][0] = -1;
        dirs[1][0] = 1;
        dirs[2][1] = -1;
        dirs[3][1] = 1;
        break;

      case 1:
        dirs[3][0] = -1;
        dirs[2][0] = 1;
        dirs[1][1] = -1;
        dirs[0][1] = 1;
        break;

      case 2:
        dirs[2][0] = -1;
        dirs[3][0] = 1;
        dirs[0][1] = -1;
        dirs[1][1] = 1;
        break;

      case 3:
        dirs[1][0] = -1;
        dirs[0][0] = 1;
        dirs[3][1] = -1;
        dirs[2][1] = 1;
        break;
    }
  }

  _isFree(map, x, y, width, height) {
    if (x < 1 || y < 1 || x >= width || y >= height) {
      return false;
    }

    return map[x][y];
  }

}

exports.default = IceyMaze;
},{"./map.js":"../node_modules/rot-js/lib/map/map.js","../rng.js":"../node_modules/rot-js/lib/rng.js"}],"../node_modules/rot-js/lib/map/rogue.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(require("./map.js"));

var _rng = _interopRequireDefault(require("../rng.js"));

var _constants = require("../constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * @author hyakugei
 */
class Rogue extends _map.default {
  constructor(width, height, options) {
    super(width, height);
    this.map = [];
    this.rooms = [];
    this.connectedCells = [];
    options = Object.assign({
      cellWidth: 3,
      cellHeight: 3 //     ie. as an array with min-max values for each direction....

    }, options);
    /*
    Set the room sizes according to the over-all width of the map,
    and the cell sizes.
    */

    if (!options.hasOwnProperty("roomWidth")) {
      options["roomWidth"] = this._calculateRoomSize(this._width, options["cellWidth"]);
    }

    if (!options.hasOwnProperty("roomHeight")) {
      options["roomHeight"] = this._calculateRoomSize(this._height, options["cellHeight"]);
    }

    this._options = options;
  }

  create(callback) {
    this.map = this._fillMap(1);
    this.rooms = [];
    this.connectedCells = [];

    this._initRooms();

    this._connectRooms();

    this._connectUnconnectedRooms();

    this._createRandomRoomConnections();

    this._createRooms();

    this._createCorridors();

    if (callback) {
      for (let i = 0; i < this._width; i++) {
        for (let j = 0; j < this._height; j++) {
          callback(i, j, this.map[i][j]);
        }
      }
    }

    return this;
  }

  _calculateRoomSize(size, cell) {
    let max = Math.floor(size / cell * 0.8);
    let min = Math.floor(size / cell * 0.25);

    if (min < 2) {
      min = 2;
    }

    if (max < 2) {
      max = 2;
    }

    return [min, max];
  }

  _initRooms() {
    // create rooms array. This is the "grid" list from the algo.
    for (let i = 0; i < this._options.cellWidth; i++) {
      this.rooms.push([]);

      for (let j = 0; j < this._options.cellHeight; j++) {
        this.rooms[i].push({
          "x": 0,
          "y": 0,
          "width": 0,
          "height": 0,
          "connections": [],
          "cellx": i,
          "celly": j
        });
      }
    }
  }

  _connectRooms() {
    //pick random starting grid
    let cgx = _rng.default.getUniformInt(0, this._options.cellWidth - 1);

    let cgy = _rng.default.getUniformInt(0, this._options.cellHeight - 1);

    let idx;
    let ncgx;
    let ncgy;
    let found = false;
    let room;
    let otherRoom;
    let dirToCheck; // find  unconnected neighbour cells

    do {
      //dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
      dirToCheck = [0, 2, 4, 6];
      dirToCheck = _rng.default.shuffle(dirToCheck);

      do {
        found = false;
        idx = dirToCheck.pop();
        ncgx = cgx + _constants.DIRS[8][idx][0];
        ncgy = cgy + _constants.DIRS[8][idx][1];

        if (ncgx < 0 || ncgx >= this._options.cellWidth) {
          continue;
        }

        if (ncgy < 0 || ncgy >= this._options.cellHeight) {
          continue;
        }

        room = this.rooms[cgx][cgy];

        if (room["connections"].length > 0) {
          // as long as this room doesn't already coonect to me, we are ok with it.
          if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
            break;
          }
        }

        otherRoom = this.rooms[ncgx][ncgy];

        if (otherRoom["connections"].length == 0) {
          otherRoom["connections"].push([cgx, cgy]);
          this.connectedCells.push([ncgx, ncgy]);
          cgx = ncgx;
          cgy = ncgy;
          found = true;
        }
      } while (dirToCheck.length > 0 && found == false);
    } while (dirToCheck.length > 0);
  }

  _connectUnconnectedRooms() {
    //While there are unconnected rooms, try to connect them to a random connected neighbor
    //(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
    let cw = this._options.cellWidth;
    let ch = this._options.cellHeight;
    this.connectedCells = _rng.default.shuffle(this.connectedCells);
    let room;
    let otherRoom;
    let validRoom;

    for (let i = 0; i < this._options.cellWidth; i++) {
      for (let j = 0; j < this._options.cellHeight; j++) {
        room = this.rooms[i][j];

        if (room["connections"].length == 0) {
          let directions = [0, 2, 4, 6];
          directions = _rng.default.shuffle(directions);
          validRoom = false;

          do {
            let dirIdx = directions.pop();
            let newI = i + _constants.DIRS[8][dirIdx][0];
            let newJ = j + _constants.DIRS[8][dirIdx][1];

            if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
              continue;
            }

            otherRoom = this.rooms[newI][newJ];
            validRoom = true;

            if (otherRoom["connections"].length == 0) {
              break;
            }

            for (let k = 0; k < otherRoom["connections"].length; k++) {
              if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
                validRoom = false;
                break;
              }
            }

            if (validRoom) {
              break;
            }
          } while (directions.length);

          if (validRoom) {
            room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
          } else {
            console.log("-- Unable to connect room.");
          }
        }
      }
    }
  }

  _createRandomRoomConnections() {// Empty for now.
  }

  _createRooms() {
    let w = this._width;
    let h = this._height;
    let cw = this._options.cellWidth;
    let ch = this._options.cellHeight;
    let cwp = Math.floor(this._width / cw);
    let chp = Math.floor(this._height / ch);
    let roomw;
    let roomh;
    let roomWidth = this._options["roomWidth"];
    let roomHeight = this._options["roomHeight"];
    let sx;
    let sy;
    let otherRoom;

    for (let i = 0; i < cw; i++) {
      for (let j = 0; j < ch; j++) {
        sx = cwp * i;
        sy = chp * j;

        if (sx == 0) {
          sx = 1;
        }

        if (sy == 0) {
          sy = 1;
        }

        roomw = _rng.default.getUniformInt(roomWidth[0], roomWidth[1]);
        roomh = _rng.default.getUniformInt(roomHeight[0], roomHeight[1]);

        if (j > 0) {
          otherRoom = this.rooms[i][j - 1];

          while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
            sy++;
          }
        }

        if (i > 0) {
          otherRoom = this.rooms[i - 1][j];

          while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
            sx++;
          }
        }

        let sxOffset = Math.round(_rng.default.getUniformInt(0, cwp - roomw) / 2);
        let syOffset = Math.round(_rng.default.getUniformInt(0, chp - roomh) / 2);

        while (sx + sxOffset + roomw >= w) {
          if (sxOffset) {
            sxOffset--;
          } else {
            roomw--;
          }
        }

        while (sy + syOffset + roomh >= h) {
          if (syOffset) {
            syOffset--;
          } else {
            roomh--;
          }
        }

        sx = sx + sxOffset;
        sy = sy + syOffset;
        this.rooms[i][j]["x"] = sx;
        this.rooms[i][j]["y"] = sy;
        this.rooms[i][j]["width"] = roomw;
        this.rooms[i][j]["height"] = roomh;

        for (let ii = sx; ii < sx + roomw; ii++) {
          for (let jj = sy; jj < sy + roomh; jj++) {
            this.map[ii][jj] = 0;
          }
        }
      }
    }
  }

  _getWallPosition(aRoom, aDirection) {
    let rx;
    let ry;
    let door;

    if (aDirection == 1 || aDirection == 3) {
      rx = _rng.default.getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);

      if (aDirection == 1) {
        ry = aRoom["y"] - 2;
        door = ry + 1;
      } else {
        ry = aRoom["y"] + aRoom["height"] + 1;
        door = ry - 1;
      }

      this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
    } else {
      ry = _rng.default.getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);

      if (aDirection == 2) {
        rx = aRoom["x"] + aRoom["width"] + 1;
        door = rx - 1;
      } else {
        rx = aRoom["x"] - 2;
        door = rx + 1;
      }

      this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
    }

    return [rx, ry];
  }

  _drawCorridor(startPosition, endPosition) {
    let xOffset = endPosition[0] - startPosition[0];
    let yOffset = endPosition[1] - startPosition[1];
    let xpos = startPosition[0];
    let ypos = startPosition[1];
    let tempDist;
    let xDir;
    let yDir;
    let move; // 2 element array, element 0 is the direction, element 1 is the total value to move.

    let moves = []; // a list of 2 element arrays

    let xAbs = Math.abs(xOffset);
    let yAbs = Math.abs(yOffset);

    let percent = _rng.default.getUniform(); // used to split the move at different places along the long axis


    let firstHalf = percent;
    let secondHalf = 1 - percent;
    xDir = xOffset > 0 ? 2 : 6;
    yDir = yOffset > 0 ? 4 : 0;

    if (xAbs < yAbs) {
      // move firstHalf of the y offset
      tempDist = Math.ceil(yAbs * firstHalf);
      moves.push([yDir, tempDist]); // move all the x offset

      moves.push([xDir, xAbs]); // move sendHalf of the  y offset

      tempDist = Math.floor(yAbs * secondHalf);
      moves.push([yDir, tempDist]);
    } else {
      //  move firstHalf of the x offset
      tempDist = Math.ceil(xAbs * firstHalf);
      moves.push([xDir, tempDist]); // move all the y offset

      moves.push([yDir, yAbs]); // move secondHalf of the x offset.

      tempDist = Math.floor(xAbs * secondHalf);
      moves.push([xDir, tempDist]);
    }

    this.map[xpos][ypos] = 0;

    while (moves.length > 0) {
      move = moves.pop();

      while (move[1] > 0) {
        xpos += _constants.DIRS[8][move[0]][0];
        ypos += _constants.DIRS[8][move[0]][1];
        this.map[xpos][ypos] = 0;
        move[1] = move[1] - 1;
      }
    }
  }

  _createCorridors() {
    // Draw Corridors between connected rooms
    let cw = this._options.cellWidth;
    let ch = this._options.cellHeight;
    let room;
    let connection;
    let otherRoom;
    let wall;
    let otherWall;

    for (let i = 0; i < cw; i++) {
      for (let j = 0; j < ch; j++) {
        room = this.rooms[i][j];

        for (let k = 0; k < room["connections"].length; k++) {
          connection = room["connections"][k];
          otherRoom = this.rooms[connection[0]][connection[1]]; // figure out what wall our corridor will start one.
          // figure out what wall our corridor will end on.

          if (otherRoom["cellx"] > room["cellx"]) {
            wall = 2;
            otherWall = 4;
          } else if (otherRoom["cellx"] < room["cellx"]) {
            wall = 4;
            otherWall = 2;
          } else if (otherRoom["celly"] > room["celly"]) {
            wall = 3;
            otherWall = 1;
          } else {
            wall = 1;
            otherWall = 3;
          }

          this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
        }
      }
    }
  }

}

exports.default = Rogue;
},{"./map.js":"../node_modules/rot-js/lib/map/map.js","../rng.js":"../node_modules/rot-js/lib/rng.js","../constants.js":"../node_modules/rot-js/lib/constants.js"}],"../node_modules/rot-js/lib/map/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _arena = _interopRequireDefault(require("./arena.js"));

var _uniform = _interopRequireDefault(require("./uniform.js"));

var _cellular = _interopRequireDefault(require("./cellular.js"));

var _digger = _interopRequireDefault(require("./digger.js"));

var _ellermaze = _interopRequireDefault(require("./ellermaze.js"));

var _dividedmaze = _interopRequireDefault(require("./dividedmaze.js"));

var _iceymaze = _interopRequireDefault(require("./iceymaze.js"));

var _rogue = _interopRequireDefault(require("./rogue.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Arena: _arena.default,
  Uniform: _uniform.default,
  Cellular: _cellular.default,
  Digger: _digger.default,
  EllerMaze: _ellermaze.default,
  DividedMaze: _dividedmaze.default,
  IceyMaze: _iceymaze.default,
  Rogue: _rogue.default
};
exports.default = _default;
},{"./arena.js":"../node_modules/rot-js/lib/map/arena.js","./uniform.js":"../node_modules/rot-js/lib/map/uniform.js","./cellular.js":"../node_modules/rot-js/lib/map/cellular.js","./digger.js":"../node_modules/rot-js/lib/map/digger.js","./ellermaze.js":"../node_modules/rot-js/lib/map/ellermaze.js","./dividedmaze.js":"../node_modules/rot-js/lib/map/dividedmaze.js","./iceymaze.js":"../node_modules/rot-js/lib/map/iceymaze.js","./rogue.js":"../node_modules/rot-js/lib/map/rogue.js"}],"../node_modules/rot-js/lib/noise/noise.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Base noise generator
 */
class Noise {}

exports.default = Noise;
},{}],"../node_modules/rot-js/lib/noise/simplex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _noise = _interopRequireDefault(require("./noise.js"));

var _rng = _interopRequireDefault(require("../rng.js"));

var _util = require("../util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
/**
 * A simple 2d implementation of simplex noise by Ondrej Zara
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 */

class Simplex extends _noise.default {
  /**
   * @param gradients Random gradients
   */
  constructor(gradients = 256) {
    super();
    this._gradients = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
    let permutations = [];

    for (let i = 0; i < gradients; i++) {
      permutations.push(i);
    }

    permutations = _rng.default.shuffle(permutations);
    this._perms = [];
    this._indexes = [];

    for (let i = 0; i < 2 * gradients; i++) {
      this._perms.push(permutations[i % gradients]);

      this._indexes.push(this._perms[i] % this._gradients.length);
    }
  }

  get(xin, yin) {
    let perms = this._perms;
    let indexes = this._indexes;
    let count = perms.length / 2;
    let n0 = 0,
        n1 = 0,
        n2 = 0,
        gi; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in

    let s = (xin + yin) * F2; // Hairy factor for 2D

    let i = Math.floor(xin + s);
    let j = Math.floor(yin + s);
    let t = (i + j) * G2;
    let X0 = i - t; // Unskew the cell origin back to (x,y) space

    let Y0 = j - t;
    let x0 = xin - X0; // The x,y distances from the cell origin

    let y0 = yin - Y0; // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.

    let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords

    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1 = 0;
      j1 = 1;
    } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6


    let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords

    let y1 = y0 - j1 + G2;
    let x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords

    let y2 = y0 - 1 + 2 * G2; // Work out the hashed gradient indices of the three simplex corners

    let ii = (0, _util.mod)(i, count);
    let jj = (0, _util.mod)(j, count); // Calculate the contribution from the three corners

    let t0 = 0.5 - x0 * x0 - y0 * y0;

    if (t0 >= 0) {
      t0 *= t0;
      gi = indexes[ii + perms[jj]];
      let grad = this._gradients[gi];
      n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;

    if (t1 >= 0) {
      t1 *= t1;
      gi = indexes[ii + i1 + perms[jj + j1]];
      let grad = this._gradients[gi];
      n1 = t1 * t1 * (grad[0] * x1 + grad[1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;

    if (t2 >= 0) {
      t2 *= t2;
      gi = indexes[ii + 1 + perms[jj + 1]];
      let grad = this._gradients[gi];
      n2 = t2 * t2 * (grad[0] * x2 + grad[1] * y2);
    } // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].


    return 70 * (n0 + n1 + n2);
  }

}

exports.default = Simplex;
},{"./noise.js":"../node_modules/rot-js/lib/noise/noise.js","../rng.js":"../node_modules/rot-js/lib/rng.js","../util.js":"../node_modules/rot-js/lib/util.js"}],"../node_modules/rot-js/lib/noise/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _simplex = _interopRequireDefault(require("./simplex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Simplex: _simplex.default
};
exports.default = _default;
},{"./simplex.js":"../node_modules/rot-js/lib/noise/simplex.js"}],"../node_modules/rot-js/lib/path/path.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("../constants.js");

/**
 * @class Abstract pathfinder
 * @param {int} toX Target X coord
 * @param {int} toY Target Y coord
 * @param {function} passableCallback Callback to determine map passability
 * @param {object} [options]
 * @param {int} [options.topology=8]
 */
class Path {
  constructor(toX, toY, passableCallback, options = {}) {
    this._toX = toX;
    this._toY = toY;
    this._passableCallback = passableCallback;
    this._options = Object.assign({
      topology: 8
    }, options);
    this._dirs = _constants.DIRS[this._options.topology];

    if (this._options.topology == 8) {
      /* reorder dirs for more aesthetic result (vertical/horizontal first) */
      this._dirs = [this._dirs[0], this._dirs[2], this._dirs[4], this._dirs[6], this._dirs[1], this._dirs[3], this._dirs[5], this._dirs[7]];
    }
  }

  _getNeighbors(cx, cy) {
    let result = [];

    for (let i = 0; i < this._dirs.length; i++) {
      let dir = this._dirs[i];
      let x = cx + dir[0];
      let y = cy + dir[1];

      if (!this._passableCallback(x, y)) {
        continue;
      }

      result.push([x, y]);
    }

    return result;
  }

}

exports.default = Path;
},{"../constants.js":"../node_modules/rot-js/lib/constants.js"}],"../node_modules/rot-js/lib/path/dijkstra.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("./path.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Simplified Dijkstra's algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
class Dijkstra extends _path.default {
  constructor(toX, toY, passableCallback, options) {
    super(toX, toY, passableCallback, options);
    this._computed = {};
    this._todo = [];

    this._add(toX, toY, null);
  }
  /**
   * Compute a path from a given point
   * @see ROT.Path#compute
   */


  compute(fromX, fromY, callback) {
    let key = fromX + "," + fromY;

    if (!(key in this._computed)) {
      this._compute(fromX, fromY);
    }

    if (!(key in this._computed)) {
      return;
    }

    let item = this._computed[key];

    while (item) {
      callback(item.x, item.y);
      item = item.prev;
    }
  }
  /**
   * Compute a non-cached value
   */


  _compute(fromX, fromY) {
    while (this._todo.length) {
      let item = this._todo.shift();

      if (item.x == fromX && item.y == fromY) {
        return;
      }

      let neighbors = this._getNeighbors(item.x, item.y);

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        let x = neighbor[0];
        let y = neighbor[1];
        let id = x + "," + y;

        if (id in this._computed) {
          continue;
        }
        /* already done */


        this._add(x, y, item);
      }
    }
  }

  _add(x, y, prev) {
    let obj = {
      x: x,
      y: y,
      prev: prev
    };
    this._computed[x + "," + y] = obj;

    this._todo.push(obj);
  }

}

exports.default = Dijkstra;
},{"./path.js":"../node_modules/rot-js/lib/path/path.js"}],"../node_modules/rot-js/lib/path/astar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("./path.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class Simplified A* algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
class AStar extends _path.default {
  constructor(toX, toY, passableCallback, options = {}) {
    super(toX, toY, passableCallback, options);
    this._todo = [];
    this._done = {};
  }
  /**
   * Compute a path from a given point
   * @see ROT.Path#compute
   */


  compute(fromX, fromY, callback) {
    this._todo = [];
    this._done = {};
    this._fromX = fromX;
    this._fromY = fromY;

    this._add(this._toX, this._toY, null);

    while (this._todo.length) {
      let item = this._todo.shift();

      let id = item.x + "," + item.y;

      if (id in this._done) {
        continue;
      }

      this._done[id] = item;

      if (item.x == fromX && item.y == fromY) {
        break;
      }

      let neighbors = this._getNeighbors(item.x, item.y);

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        let x = neighbor[0];
        let y = neighbor[1];
        let id = x + "," + y;

        if (id in this._done) {
          continue;
        }

        this._add(x, y, item);
      }
    }

    let item = this._done[fromX + "," + fromY];

    if (!item) {
      return;
    }

    while (item) {
      callback(item.x, item.y);
      item = item.prev;
    }
  }

  _add(x, y, prev) {
    let h = this._distance(x, y);

    let obj = {
      x: x,
      y: y,
      prev: prev,
      g: prev ? prev.g + 1 : 0,
      h: h
    };
    /* insert into priority queue */

    let f = obj.g + obj.h;

    for (let i = 0; i < this._todo.length; i++) {
      let item = this._todo[i];
      let itemF = item.g + item.h;

      if (f < itemF || f == itemF && h < item.h) {
        this._todo.splice(i, 0, obj);

        return;
      }
    }

    this._todo.push(obj);
  }

  _distance(x, y) {
    switch (this._options.topology) {
      case 4:
        return Math.abs(x - this._fromX) + Math.abs(y - this._fromY);
        break;

      case 6:
        let dx = Math.abs(x - this._fromX);
        let dy = Math.abs(y - this._fromY);
        return dy + Math.max(0, (dx - dy) / 2);
        break;

      case 8:
        return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
        break;
    }
  }

}

exports.default = AStar;
},{"./path.js":"../node_modules/rot-js/lib/path/path.js"}],"../node_modules/rot-js/lib/path/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dijkstra = _interopRequireDefault(require("./dijkstra.js"));

var _astar = _interopRequireDefault(require("./astar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  Dijkstra: _dijkstra.default,
  AStar: _astar.default
};
exports.default = _default;
},{"./dijkstra.js":"../node_modules/rot-js/lib/path/dijkstra.js","./astar.js":"../node_modules/rot-js/lib/path/astar.js"}],"../node_modules/rot-js/lib/engine.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @class Asynchronous main loop
 * @param {ROT.Scheduler} scheduler
 */
class Engine {
  constructor(scheduler) {
    this._scheduler = scheduler;
    this._lock = 1;
  }
  /**
   * Start the main loop. When this call returns, the loop is locked.
   */


  start() {
    return this.unlock();
  }
  /**
   * Interrupt the engine by an asynchronous action
   */


  lock() {
    this._lock++;
    return this;
  }
  /**
   * Resume execution (paused by a previous lock)
   */


  unlock() {
    if (!this._lock) {
      throw new Error("Cannot unlock unlocked engine");
    }

    this._lock--;

    while (!this._lock) {
      let actor = this._scheduler.next();

      if (!actor) {
        return this.lock();
      }
      /* no actors */


      let result = actor.act();

      if (result && result.then) {
        /* actor returned a "thenable", looks like a Promise */
        this.lock();
        result.then(this.unlock.bind(this));
      }
    }

    return this;
  }

}

exports.default = Engine;
},{}],"../node_modules/rot-js/lib/lighting.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Color = _interopRequireWildcard(require("./color.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

;
;
;
;
/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */

class Lighting {
  constructor(reflectivityCallback, options = {}) {
    this._reflectivityCallback = reflectivityCallback;
    this._options = {};
    options = Object.assign({
      passes: 1,
      emissionThreshold: 100,
      range: 10
    }, options);
    this._lights = {};
    this._reflectivityCache = {};
    this._fovCache = {};
    this.setOptions(options);
  }
  /**
   * Adjust options at runtime
   */


  setOptions(options) {
    Object.assign(this._options, options);

    if (options && options.range) {
      this.reset();
    }

    return this;
  }
  /**
   * Set the used Field-Of-View algo
   */


  setFOV(fov) {
    this._fov = fov;
    this._fovCache = {};
    return this;
  }
  /**
   * Set (or remove) a light source
   */


  setLight(x, y, color) {
    let key = x + "," + y;

    if (color) {
      this._lights[key] = typeof color == "string" ? Color.fromString(color) : color;
    } else {
      delete this._lights[key];
    }

    return this;
  }
  /**
   * Remove all light sources
   */


  clearLights() {
    this._lights = {};
  }
  /**
   * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
   */


  reset() {
    this._reflectivityCache = {};
    this._fovCache = {};
    return this;
  }
  /**
   * Compute the lighting
   */


  compute(lightingCallback) {
    let doneCells = {};
    let emittingCells = {};
    let litCells = {};

    for (let key in this._lights) {
      /* prepare emitters for first pass */
      let light = this._lights[key];
      emittingCells[key] = [0, 0, 0];
      Color.add_(emittingCells[key], light);
    }

    for (let i = 0; i < this._options.passes; i++) {
      /* main loop */
      this._emitLight(emittingCells, litCells, doneCells);

      if (i + 1 == this._options.passes) {
        continue;
      }
      /* not for the last pass */


      emittingCells = this._computeEmitters(litCells, doneCells);
    }

    for (let litKey in litCells) {
      /* let the user know what and how is lit */
      let parts = litKey.split(",");
      let x = parseInt(parts[0]);
      let y = parseInt(parts[1]);
      lightingCallback(x, y, litCells[litKey]);
    }

    return this;
  }
  /**
   * Compute one iteration from all emitting cells
   * @param emittingCells These emit light
   * @param litCells Add projected light to these
   * @param doneCells These already emitted, forbid them from further calculations
   */


  _emitLight(emittingCells, litCells, doneCells) {
    for (let key in emittingCells) {
      let parts = key.split(",");
      let x = parseInt(parts[0]);
      let y = parseInt(parts[1]);

      this._emitLightFromCell(x, y, emittingCells[key], litCells);

      doneCells[key] = 1;
    }

    return this;
  }
  /**
   * Prepare a list of emitters for next pass
   */


  _computeEmitters(litCells, doneCells) {
    let result = {};

    for (let key in litCells) {
      if (key in doneCells) {
        continue;
      }
      /* already emitted */


      let color = litCells[key];
      let reflectivity;

      if (key in this._reflectivityCache) {
        reflectivity = this._reflectivityCache[key];
      } else {
        let parts = key.split(",");
        let x = parseInt(parts[0]);
        let y = parseInt(parts[1]);
        reflectivity = this._reflectivityCallback(x, y);
        this._reflectivityCache[key] = reflectivity;
      }

      if (reflectivity == 0) {
        continue;
      }
      /* will not reflect at all */

      /* compute emission color */


      let emission = [0, 0, 0];
      let intensity = 0;

      for (let i = 0; i < 3; i++) {
        let part = Math.round(color[i] * reflectivity);
        emission[i] = part;
        intensity += part;
      }

      if (intensity > this._options.emissionThreshold) {
        result[key] = emission;
      }
    }

    return result;
  }
  /**
   * Compute one iteration from one cell
   */


  _emitLightFromCell(x, y, color, litCells) {
    let key = x + "," + y;
    let fov;

    if (key in this._fovCache) {
      fov = this._fovCache[key];
    } else {
      fov = this._updateFOV(x, y);
    }

    for (let fovKey in fov) {
      let formFactor = fov[fovKey];
      let result;

      if (fovKey in litCells) {
        /* already lit */
        result = litCells[fovKey];
      } else {
        /* newly lit */
        result = [0, 0, 0];
        litCells[fovKey] = result;
      }

      for (let i = 0; i < 3; i++) {
        result[i] += Math.round(color[i] * formFactor);
      }
      /* add light color */

    }

    return this;
  }
  /**
   * Compute FOV ("form factor") for a potential light source at [x,y]
   */


  _updateFOV(x, y) {
    let key1 = x + "," + y;
    let cache = {};
    this._fovCache[key1] = cache;
    let range = this._options.range;

    function cb(x, y, r, vis) {
      let key2 = x + "," + y;
      let formFactor = vis * (1 - r / range);

      if (formFactor == 0) {
        return;
      }

      cache[key2] = formFactor;
    }

    ;

    this._fov.compute(x, y, range, cb.bind(this));

    return cache;
  }

}

exports.default = Lighting;
},{"./color.js":"../node_modules/rot-js/lib/color.js"}],"../node_modules/rot-js/lib/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RNG", {
  enumerable: true,
  get: function () {
    return _rng.default;
  }
});
Object.defineProperty(exports, "Display", {
  enumerable: true,
  get: function () {
    return _display.default;
  }
});
Object.defineProperty(exports, "StringGenerator", {
  enumerable: true,
  get: function () {
    return _stringgenerator.default;
  }
});
Object.defineProperty(exports, "EventQueue", {
  enumerable: true,
  get: function () {
    return _eventqueue.default;
  }
});
Object.defineProperty(exports, "Scheduler", {
  enumerable: true,
  get: function () {
    return _index.default;
  }
});
Object.defineProperty(exports, "FOV", {
  enumerable: true,
  get: function () {
    return _index2.default;
  }
});
Object.defineProperty(exports, "Map", {
  enumerable: true,
  get: function () {
    return _index3.default;
  }
});
Object.defineProperty(exports, "Noise", {
  enumerable: true,
  get: function () {
    return _index4.default;
  }
});
Object.defineProperty(exports, "Path", {
  enumerable: true,
  get: function () {
    return _index5.default;
  }
});
Object.defineProperty(exports, "Engine", {
  enumerable: true,
  get: function () {
    return _engine.default;
  }
});
Object.defineProperty(exports, "Lighting", {
  enumerable: true,
  get: function () {
    return _lighting.default;
  }
});
Object.defineProperty(exports, "DEFAULT_WIDTH", {
  enumerable: true,
  get: function () {
    return _constants.DEFAULT_WIDTH;
  }
});
Object.defineProperty(exports, "DEFAULT_HEIGHT", {
  enumerable: true,
  get: function () {
    return _constants.DEFAULT_HEIGHT;
  }
});
Object.defineProperty(exports, "DIRS", {
  enumerable: true,
  get: function () {
    return _constants.DIRS;
  }
});
Object.defineProperty(exports, "KEYS", {
  enumerable: true,
  get: function () {
    return _constants.KEYS;
  }
});
exports.Text = exports.Color = exports.Util = void 0;

var _rng = _interopRequireDefault(require("./rng.js"));

var _display = _interopRequireDefault(require("./display/display.js"));

var _stringgenerator = _interopRequireDefault(require("./stringgenerator.js"));

var _eventqueue = _interopRequireDefault(require("./eventqueue.js"));

var _index = _interopRequireDefault(require("./scheduler/index.js"));

var _index2 = _interopRequireDefault(require("./fov/index.js"));

var _index3 = _interopRequireDefault(require("./map/index.js"));

var _index4 = _interopRequireDefault(require("./noise/index.js"));

var _index5 = _interopRequireDefault(require("./path/index.js"));

var _engine = _interopRequireDefault(require("./engine.js"));

var _lighting = _interopRequireDefault(require("./lighting.js"));

var _constants = require("./constants.js");

var util = _interopRequireWildcard(require("./util.js"));

var color = _interopRequireWildcard(require("./color.js"));

var text = _interopRequireWildcard(require("./text.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Util = util;
exports.Util = Util;
const Color = color;
exports.Color = Color;
const Text = text;
exports.Text = Text;
},{"./rng.js":"../node_modules/rot-js/lib/rng.js","./display/display.js":"../node_modules/rot-js/lib/display/display.js","./stringgenerator.js":"../node_modules/rot-js/lib/stringgenerator.js","./eventqueue.js":"../node_modules/rot-js/lib/eventqueue.js","./scheduler/index.js":"../node_modules/rot-js/lib/scheduler/index.js","./fov/index.js":"../node_modules/rot-js/lib/fov/index.js","./map/index.js":"../node_modules/rot-js/lib/map/index.js","./noise/index.js":"../node_modules/rot-js/lib/noise/index.js","./path/index.js":"../node_modules/rot-js/lib/path/index.js","./engine.js":"../node_modules/rot-js/lib/engine.js","./lighting.js":"../node_modules/rot-js/lib/lighting.js","./constants.js":"../node_modules/rot-js/lib/constants.js","./util.js":"../node_modules/rot-js/lib/util.js","./color.js":"../node_modules/rot-js/lib/color.js","./text.js":"../node_modules/rot-js/lib/text.js"}],"../src/index.ts":[function(require,module,exports) {
"use strict";

var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = this && this.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var rot_js_1 = require("rot-js");

var MoveCommand =
/** @class */
function () {
  function MoveCommand() {}

  MoveCommand.prototype.execute = function (actor) {};

  return MoveCommand;
}();

var InputHandler =
/** @class */
function () {
  function InputHandler() {}

  InputHandler.prototype.handleInput = function (input) {
    // Check if button is pressed
    if (input === 'D') {
      return this.buttonRight;
    }

    return null;
  };

  return InputHandler;
}();

var Player =
/** @class */
function () {
  function Player(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
  }

  Player.prototype.render = function () {
    this.game.display.draw(this.x, this.y, "@", "#fff", "#000");
  };

  Player.prototype.act = function () {
    var _this = this;

    this.game.engine.lock();

    var eventHandler = function eventHandler(event) {
      _this.handleEvent(event, _this.game.map);

      _this.render();

      _this.game.renderMap();

      _this.game.engine.unlock();
    };

    window.addEventListener('keydown', eventHandler, {
      once: true
    });
  };

  Player.prototype.handleEvent = function (event, map) {
    var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;
    var code = event.keyCode;

    if (!(code in keyMap)) {
      return;
    }

    var diff = rot_js_1.DIRS[8][keyMap[code]];
    var newX = this.x + diff[0];
    var newY = this.y + diff[1];
    var newKey = newX + ',' + newY; // Cannot move in this direction

    if (!(newKey in map)) {
      return;
    }

    this.x = newX;
    this.y = newY;
  };

  return Player;
}();

var TILE_DELIMITER = '/';

var Game =
/** @class */
function () {
  function Game(options) {
    this.options = {
      width: 40,
      height: 12
    };
    this.map = {};
    this.options = __assign(__assign({}, this.options), options);
  }

  Game.prototype.init = function () {
    var _this = this;

    this.scheduler = new rot_js_1.Scheduler.Simple();
    this.engine = new rot_js_1.Engine(this.scheduler);
    this.display = new rot_js_1.Display({
      width: this.options.width,
      height: this.options.height
    });
    document.body.appendChild(this.display.getContainer());
    this.generateMap();
    this.generateBoxes();
    this.createPlayer();
    this.display.getContainer().addEventListener('mousemove', function (e) {
      return _this.onMouseMove(e);
    });
    this.engine.start();
  };

  Game.prototype.onMouseMove = function (event) {
    // Get hovered tile
    var position = this.display.eventToPosition(event);
    this.highlightTile(position);
  };

  Game.prototype.highlightTile = function (position) {
    var key = position[0] + "," + position[1];
    var tile = this.map[key];

    if (tile) {
      var parts = tile.split(TILE_DELIMITER);
      var icon = parts[0];
      var fg = parts[1];
      console.log('highlighting', key, tile);
      this.map[key] = this.createTile(icon, fg, '#0f0');
    }
  };

  Game.prototype.createTile = function (icon, fg, bg) {
    return "" + icon + TILE_DELIMITER + fg + TILE_DELIMITER + bg;
  };

  Game.prototype.run = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        this.engine.start();
        return [2
        /*return*/
        ];
      });
    });
  };

  Game.prototype.createPlayer = function () {
    var freeCells = this.getFreeCells();
    var index = Math.floor(rot_js_1.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(',');
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    this.player = new Player(this, x, y);
    this.scheduler.add(this.player, true);
  };

  Game.prototype.renderMap = function () {
    for (var key in this.map) {
      var parts = key.split(',');
      var x = parseInt(parts[0]);
      var y = parseInt(parts[1]);
      var tile = this.map[key];
      var tileParts = tile.split(TILE_DELIMITER);
      var icon = tileParts[0];
      var fg = tileParts[1] || '#fff';
      var bg = tileParts[2] || '#000';
      this.display.draw(x, y, icon, fg, bg);
    }
  };

  Game.prototype.generateMap = function () {
    var _this = this;

    var digger = new rot_js_1.Map.Digger(this.options.width, this.options.height);
    digger.create(function (x, y, value) {
      // Do not store walls
      if (value) {
        return;
      }

      var key = x + "," + y;
      var icon = '.';
      var fg = '#fff';
      var bg = '#000';
      _this.map[key] = "" + icon + TILE_DELIMITER + fg + TILE_DELIMITER + bg;
    });
    this.renderMap();
  };

  Game.prototype.getFreeCells = function () {
    return Object.entries(this.map).filter(function (_a) {
      var k = _a[0],
          v = _a[1];
      return v[0] === '.';
    }).map(function (_a) {
      var k = _a[0];
      return k;
    });
  };

  Game.prototype.generateBoxes = function () {
    var freeCells = this.getFreeCells();

    for (var i = 0; i < 10; ++i) {
      var index = Math.floor(rot_js_1.RNG.getUniform() * freeCells.length);
      var key = freeCells.splice(index, 1)[0];
      this.map[key] = '*';
    }
  };

  return Game;
}();

exports.Game = Game;

function main() {
  var game = new Game({
    width: 80,
    height: 20
  });
  game.init(); // game.run()
}

exports.main = main;
window.addEventListener('load', main);
},{"rot-js":"../node_modules/rot-js/lib/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35893" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/index.ts"], null)
//# sourceMappingURL=/src.9caef6c7.js.map