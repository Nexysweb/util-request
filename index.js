"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _i18n = _interopRequireDefault(require("./dist/i18n"));

var _request = _interopRequireDefault(require("./dist/request"));

var _store = _interopRequireDefault(require("./dist/store"));

var _utils = _interopRequireDefault(require("./dist/utils"));

var _default = {
  I18n: _i18n["default"],
  Request: _request["default"],
  Store: _store["default"],
  Utils: _utils["default"]
};
/*
"use strict";

//var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _i18n = (require("./dist/i18n"));
var _request = (require("./dist/request"));
var _store = (require("./dist/store"));

var _default = {
  I18n: _i18n["default"],
  Request: _request["default"],
  Store: _store["store"]
};
exports["default"] = _default;*/

exports["default"] = _default;
