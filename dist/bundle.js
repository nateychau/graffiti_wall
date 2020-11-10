/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util.js */ "./src/util.js");

var drawing = false;
var playSound = true;
var coord;
var brushSize = 5;
var brushSizeRate = 0.1;
var pauseTime = 0;
var xLast;
var yLast;
var spraySize = 10;
var HOLD_THRESHOLD = 50;
var SPRAY_DENSITY = 50;
var sprayId = 0;
var onHold = false;
window.addEventListener("DOMContentLoaded", function (event) {
  var canvas = document.getElementById("canvas"); //Spray sound properties

  var spraySound = new Audio();
  spraySound.src = '../dist/assets/spray_sound.mp3';
  spraySound.loop = true;
  spraySound.volume = 0.45; //Event listener for semi-gapless looping

  spraySound.addEventListener('timeupdate', function (e) {
    var buffer = .5;

    if (playSound && !this.paused && this.currentTime > this.duration - buffer) {
      this.currentTime = 1;
      this.play();
    }
  }); //Audio on/off controls

  var soundButton = document.getElementById("sound-icon");
  soundButton.addEventListener('click', function () {
    if (playSound) {
      this.classList.remove('fa-volume-up');
      this.classList.add('fa-volume-mute');
      playSound = false;
    } else {
      this.classList.remove('fa-volume-mute');
      this.classList.add('fa-volume-up');
      playSound = true;
    }
  });
  var colorPicker = new iro.ColorPicker('#picker', {
    width: 100
  });
  var ctx = canvas.getContext("2d"); //event listener for color picker

  ctx.fillStyle = colorPicker.color.hexString;
  colorPicker.on('color:change', function (color) {
    ctx.fillStyle = color.hexString;
  }); //Density is controlled by a range input slider. (We can adjust min and max values of the slider, currently 1-100, default 50)

  var densitySlider = document.getElementById("density-slider");

  densitySlider.oninput = function (e) {
    SPRAY_DENSITY = e.target.value;
    console.log(SPRAY_DENSITY);
  }; //Reticle slider handles need to be tweaked


  var reticleSlider = document.getElementById("reticle-slider");

  reticleSlider.oninput = function (e) {
    spraySize = e.target.value / 2;
    SPRAY_DENSITY = spraySize;
  };

  var spray = function spray() {
    for (var i = 0; i < SPRAY_DENSITY; i++) {
      var noise = _util_js__WEBPACK_IMPORTED_MODULE_0__["rndSprayParticle"](spraySize);
      var x = coord.x + noise.x;
      var y = coord.y + noise.y;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  canvas.addEventListener("mousedown", function (e) {
    drawing = true;
    coord = _util_js__WEBPACK_IMPORTED_MODULE_0__["getPosition"](e, canvas); //get start point for line

    ctx.moveTo(coord.x, coord.y);
    xLast = coord.x;
    yLast = coord.y;
    ctx.lineWidth = 5;
    spray();

    if (playSound) {
      spraySound.play();
    }
  });
  document.addEventListener("mousemove", function (e) {
    if (!drawing) return;
    clearInterval(sprayId);
    coord = _util_js__WEBPACK_IMPORTED_MODULE_0__["getPosition"](e, canvas);
    spray(); // const dx = coord.x - xLast;
    // const dy = coord.y - yLast;

    sprayId = setInterval(spray, 20); // ctx.lineCap = "round";
    // ctx.strokeStyle = "black";
    // ctx.lineTo(coord.x, coord.y);
    // ctx.stroke();
  });
  document.addEventListener("mouseup", function (e) {
    if (!drawing) return;
    clearInterval(sprayId);
    drawing = false;
    spraySound.pause();
  });
});

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! exports provided: getPosition, isOutOfBound, rndSprayParticle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPosition", function() { return getPosition; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isOutOfBound", function() { return isOutOfBound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rndSprayParticle", function() { return rndSprayParticle; });
var getPosition = function getPosition(event, canvas) {
  var bound = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - bound.left) / bound.width * canvas.width,
    y: (event.clientY - bound.top) / bound.height * canvas.height
  };
};
var isOutOfBound = function isOutOfBound(coord, canvas) {
  return coord.x > canvas.width || coord.x < 0 || coord.y > canvas.height || coord.y < 0;
}; //Use Box–Muller transform to create rnd particle pairs with guassian distribution

var rndSprayParticle = function rndSprayParticle(sigma) {
  var u1 = Math.random();
  var u2 = Math.random();
  var mag = sigma * Math.sqrt(-2 * Math.log(u1));
  var x = mag * Math.cos(2 * Math.PI * u2);
  var y = mag * Math.sin(2 * Math.PI * u2);
  return {
    x: x,
    y: y
  };
};

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map