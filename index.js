/*import I18n from './dist/i18n';
import Request from './dist/request';

export default { I18n, Request };*/

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
  Store: _request["store"]
};
exports["default"] = _default;