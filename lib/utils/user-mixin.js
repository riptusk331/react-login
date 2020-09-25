"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var UserMixin = /*#__PURE__*/function () {
  function UserMixin(tokenObj) {
    (0, _classCallCheck2.default)(this, UserMixin);
    this.tokenObj = tokenObj;
  }

  (0, _createClass2.default)(UserMixin, [{
    key: "token",
    get: function get() {
      return this.tokenObj.token;
    }
  }]);
  return UserMixin;
}();

exports.default = UserMixin;