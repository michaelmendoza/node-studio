(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("dicom-parser"));
	else if(typeof define === 'function' && define.amd)
		define(["dicom-parser"], factory);
	else if(typeof exports === 'object')
		exports["lib"] = factory(require("dicom-parser"));
	else
		root["imageviewr"] = root["imageviewr"] || {}, root["imageviewr"]["lib"] = factory(root["dicom-parser"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_60__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _imageFileStore = __webpack_require__(57);

	var _imageFileStore2 = _interopRequireDefault(_imageFileStore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _imageFileStore2.default;

/***/ },

/***/ 55:
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },

/***/ 57:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _events = __webpack_require__(55);

	var _events2 = _interopRequireDefault(_events);

	var _file = __webpack_require__(58);

	var _file2 = _interopRequireDefault(_file);

	var _fileSet = __webpack_require__(61);

	var _fileSet2 = _interopRequireDefault(_fileSet);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ImageFileStore = function (_EventEmitter) {
		_inherits(ImageFileStore, _EventEmitter);

		function ImageFileStore() {
			_classCallCheck(this, ImageFileStore);

			var _this = _possibleConstructorReturn(this, (ImageFileStore.__proto__ || Object.getPrototypeOf(ImageFileStore)).call(this));

			_this.files = [];

			_this.getLoadedFiles = _this.getLoadedFiles.bind(_this);
			_this.readFile = _this.readFile.bind(_this);
			return _this;
		}

		_createClass(ImageFileStore, [{
			key: 'getLoadedFiles',
			value: function getLoadedFiles() {
				return this.files;
			}
		}, {
			key: 'readFile',
			value: function readFile(event) {
				var _this2 = this;

				var files = event.dataTransfer.files;

				var isDicomSet = true;
				for (var i = 0; i < files.length; i++) {
					isDicomSet = files[i].type == "application/dicom" ? isDicomSet : false;
				}

				if (isDicomSet && files.length > 1) {
					// Load a 3D dicom dataset
					var dataset = new _fileSet2.default(files, function () {
						_this2.emit('filesloaded');
					});
					this.files.push(dataset);
				} else {
					// Load a series of files
					for (var i = 0; i < files.length; i++) {

						var file = new _file2.default(files[i], function () {
							if (file.type == 'dicom') file.img = file.dicom.createImg();

							_this2.emit('filesloaded');
						});

						this.files.push(file);
					}
				}
			}
		}]);

		return ImageFileStore;
	}(_events2.default);

	exports.default = new ImageFileStore();

/***/ },

/***/ 58:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _fileDicom = __webpack_require__(59);

	var _fileDicom2 = _interopRequireDefault(_fileDicom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var File = function () {
		function File(file, fileLoadedCallback) {
			var _this = this;

			_classCallCheck(this, File);

			this.filename = file.name;
			this.type = null;
			this.img = null;
			this.fileLoadedCallback = fileLoadedCallback;

			var readers = {
				"image/png": function imagePng() {
					_this.readPNG(file);
				},
				"image/jpeg": function imageJpeg() {
					_this.readJPEG(file);
				},
				"application/dicom": function applicationDicom() {
					_this.readDICOM(file);
				}
			};
			readers[file.type]();
		}

		_createClass(File, [{
			key: "readPNG",
			value: function readPNG(file) {
				var _this2 = this;

				var reader = new FileReader();
				reader.onload = function (event) {
					var img = document.createElement('img');
					img.src = event.target.result;
					_this2.type = 'png';
					_this2.img = img;
					_this2.fileLoadedCallback();
				};
				reader.readAsDataURL(file);
			}
		}, {
			key: "readJPEG",
			value: function readJPEG(file) {
				var _this3 = this;

				var reader = new FileReader();
				reader.onload = function (event) {
					var img = document.createElement('img');
					img.src = event.target.result;
					_this3.type = 'jpeg';
					_this3.img = img;
					_this3.fileLoadedCallback();
				};
				reader.readAsDataURL(file);
			}
		}, {
			key: "readDICOM",
			value: function readDICOM(file) {
				var _this4 = this;

				var reader = new FileReader();
				reader.onload = function (event) {
					var dicom = new _fileDicom2.default(event);
					_this4.dicom = dicom;
					_this4.type = 'dicom';
					_this4.img = dicom.img;
					_this4.width = dicom.width;
					_this4.height = dicom.height;
					_this4.numPixels = dicom.numPixels;
					_this4.pixelData = dicom.pixelData;
					_this4.header = dicom.header;
					_this4.fileLoadedCallback();
				};
				reader.readAsArrayBuffer(file);
			}
		}]);

		return File;
	}();

	exports.default = File;

/***/ },

/***/ 59:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dicomParser = __webpack_require__(60);

	var _dicomParser2 = _interopRequireDefault(_dicomParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FileDICOM = function () {
		function FileDICOM(event) {
			_classCallCheck(this, FileDICOM);

			this.readDICOM(event);
		}

		_createClass(FileDICOM, [{
			key: 'readDICOM',
			value: function readDICOM(event) {
				var frame = 0;
				var arrayBuffer = event.target.result;
				var byteArray = new Uint8Array(arrayBuffer);
				var dataSet = _dicomParser2.default.parseDicom(byteArray);

				var headerUIDs = {
					patientId: 'x00100020',
					patientName: 'x00100010',
					studyId: 'x00200010',
					studyDescription: 'x00081030',
					studyDate: 'x00080020',
					studyTime: 'x00080030',
					protocolName: 'x00181030',
					seriesDescription: 'x0008103e',
					seriesNumber: 'x00200011',
					modality: 'x00080060',
					instanceNumber: 'x00200013',
					acquistionNumber: 'x00200012',

					rows: 'x00280010',
					columns: 'x00280011',
					samplesPerPixel: 'x00280002',
					pixelSpacing: 'x00280030',
					sliceThickness: 'x00180050',
					bitsStored: 'x00280101',

					transferSyntax: 'x00020010' // Explicit VR Little Endian - "1.2.840.10008.1.2.1"
				};

				var header = {};
				for (var key in headerUIDs) {
					if (key == 'rows' || key == 'columns' || key == 'samplesPerPixel' || key == 'bitsStored') header[key] = dataSet.uint16(headerUIDs[key]);else header[key] = dataSet.string(headerUIDs[key]);
				}

				var rows = header.rows;
				var columns = header.columns;
				var samplesPerPixel = header.samplesPerPixel;
				var numPixels = rows * columns * samplesPerPixel;

				var pixelDataElement = dataSet.elements.x7fe00010;
				var pixelDataOffset = pixelDataElement.dataOffset;

				var pixelFormat = this.getPixelFormat(dataSet);
				var bytesPerPixel = this.getBytesPerPixel(pixelFormat);
				var frameOffset = pixelDataOffset + frame * numPixels * bytesPerPixel;
				if (frameOffset >= dataSet.byteArray.length) {
					throw 'frame exceeds size of pixelData';
				}
				if (frameOffset + numPixels > dataSet.byteArray.length) {
					console.log('Error: Invalid File Format, Uses compressed data.');
				}

				var pixelData = new Uint16Array(dataSet.byteArray.buffer, frameOffset, numPixels);

				this.header = header;
				this.width = columns;
				this.height = rows;
				this.numPixels = numPixels;
				this.pixelData = pixelData;
			}
		}, {
			key: 'createImg',
			value: function createImg() {
				var canvas = document.createElement('canvas');
				canvas.width = this.width;
				canvas.height = this.height;

				var context = canvas.getContext('2d');
				var numPixels = this.width * this.height;
				var imageData = context.getImageData(0, 0, this.width, this.height);

				var maxValue = 0;
				for (var i = 0; i < numPixels; i++) {
					maxValue = maxValue >= this.pixelData[i] ? maxValue : this.pixelData[i];
				}
				var resolution = maxValue; //Math.pow(2,bitsStored);

				for (var i = 0; i < numPixels; i++) {
					var value = this.pixelData[i] * 255 / resolution;
					imageData.data[4 * i] = value;
					imageData.data[4 * i + 1] = value;
					imageData.data[4 * i + 2] = value;
					imageData.data[4 * i + 3] = 255;
				}
				context.putImageData(imageData, 0, 0);
				var dataURL = canvas.toDataURL();

				var img = document.createElement('img');
				img.src = dataURL;

				this.img = img;
				return img;
			}
		}, {
			key: 'getPixelFormat',
			value: function getPixelFormat(dataSet) {
				var pixelRepresentation = dataSet.uint16('x00280103');
				var bitsAllocated = dataSet.uint16('x00280100');
				if (pixelRepresentation === 0 && bitsAllocated === 8) {
					return 1; // unsigned 8 bit
				} else if (pixelRepresentation === 0 && bitsAllocated === 16) {
					return 2; // unsigned 16 bit
				} else if (pixelRepresentation === 1 && bitsAllocated === 16) {
					return 3; // signed 16 bit data
				}
			}
		}, {
			key: 'getBytesPerPixel',
			value: function getBytesPerPixel(pixelFormat) {
				if (pixelFormat === 1) {
					return 1;
				} else if (pixelFormat === 2 || pixelFormat === 3) {
					return 2;
				}
				throw "unknown pixel format";
			}
		}]);

		return FileDICOM;
	}();

	exports.default = FileDICOM;

/***/ },

/***/ 60:
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_60__;

/***/ },

/***/ 61:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _file = __webpack_require__(58);

	var _file2 = _interopRequireDefault(_file);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FileSet = function () {
		function FileSet(files, fileLoadedCallback) {
			_classCallCheck(this, FileSet);

			this.files = files;
			this.type = 'dicom-3d';
			this.img = null;
			this.fileLoadedCallback = fileLoadedCallback;

			this.readDICOMs();
		}

		_createClass(FileSet, [{
			key: 'getBounds',
			value: function getBounds(dimIndex) {
				var bounds = [{ width: this.width, height: this.height, dx: this.pixelSpacing.x, dy: this.pixelSpacing.y }, // x, y
				{ width: this.depth, height: this.width, dx: this.sliceThickness, dy: this.pixelSpacing.x }, // z, x
				{ width: this.depth, height: this.height, dx: this.sliceThickness, dy: this.pixelSpacing.y } // z, y
				];
				var width = bounds[dimIndex].width;
				var height = bounds[dimIndex].height;
				var dx = bounds[dimIndex].dx;
				var dy = bounds[dimIndex].dy;
				return { width: width, height: height, dx: dx, dy: dy };
			}
		}, {
			key: 'isLoaded',
			value: function isLoaded() {
				this.loadedCount++;
				if (this.loadedCount == this.files.length) {
					this.width = this.fileset[0].width;
					this.height = this.fileset[0].height;
					this.depth = this.loadedCount;
					this.img = this.fileset[Math.floor(this.depth / 2)].dicom.createImg();

					this.pixelSpacing = this.fileset[0].header.pixelSpacing;
					if (this.pixelSpacing !== undefined) {
						this.pixelSpacing = this.pixelSpacing.split('\\');
						this.pixelSpacing = { x: parseFloat(this.pixelSpacing[0]), y: parseFloat(this.pixelSpacing[1]) };
					}
					this.sliceThickness = this.fileset[0].header.sliceThickness;
					this.sliceThickness = parseFloat(this.sliceThickness);

					this.pixelData = [];
					for (var i = 0; i < this.files.length; i++) {
						this.pixelData.push(this.fileset[i].pixelData);
					}

					this.fileLoadedCallback();
				}
			}
		}, {
			key: 'readDICOMs',
			value: function readDICOMs() {
				this.loadedCount = 0;
				this.fileset = [];
				for (var i = 0; i < this.files.length; i++) {
					var file = new _file2.default(this.files[i], this.isLoaded.bind(this));
					this.fileset.push(file);
				}
			}
		}]);

		return FileSet;
	}();

	exports.default = FileSet;

/***/ }

/******/ })
});
;