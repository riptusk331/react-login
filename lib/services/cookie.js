"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSessionCookie = exports.getRememberCookie = exports.setRememberCookie = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _universalCookie = _interopRequireDefault(require("universal-cookie"));

var _hmacSha = _interopRequireDefault(require("crypto-js/hmac-sha512"));

var _encUtf = _interopRequireDefault(require("crypto-js/enc-utf8"));

var _encHex = _interopRequireDefault(require("crypto-js/enc-hex"));

var _encBase = _interopRequireDefault(require("crypto-js/enc-base64"));

var _config = require("../config");

var _util = require("../utils/util");

var cookies = new _universalCookie.default();

var setRememberCookie = function setRememberCookie(payload) {
  cookies.set(_config.REMEMBER_COOKIE_NAME, _encodeRememberCookie(payload, process.env.REACT_APP_SECRET_KEY), {
    maxAge: _config.REMEMBER_COOKIE_LENGTH,
    sameSite: _config.REMEMBER_COOKIE_SAMESITE,
    encode: encodeURI
  });
};

exports.setRememberCookie = setRememberCookie;

var getRememberCookie = function getRememberCookie() {
  var cookie = cookies.get(_config.REMEMBER_COOKIE_NAME, {
    decode: decodeURI
  });
  return cookie ? _decodeRememberCookie(cookie) : null;
};

exports.getRememberCookie = getRememberCookie;

var setSessionCookie = function setSessionCookie(jwt) {
  cookies.set(_config.JWT_COOKIE_NAME, jwt, {
    maxAge: _config.JWT_COOKIE_LENGTH,
    sameSite: _config.JWT_COOKIE_SAMESITE
  });
};

exports.setSessionCookie = setSessionCookie;

var _encodeRememberCookie = function _encodeRememberCookie(payload, key) {
  /* Use the supplied payload and secret key to create a Base64 encoded
  "remember-rl" cookie for react-login to securely authenticate long term
  between sessions.
  Returns the Base64 encoded cookie
  */
  var encPayload = _encBase.default.stringify(_encUtf.default.parse(payload));

  var encCookie = "".concat(encPayload, ".").concat(_rememberCookieDigest(payload, key));
  return encCookie;
};

var _decodeRememberCookie = function _decodeRememberCookie(cookie) {
  /* Take a Base64 encoded "remember-rl" cookie set by react-login and
  validate it. If the cookie checks out, return the decoded cookie payload.
  Performs a bitwise comparison of the cookie digest vs the test digest to
  defend against timing attacks.
  */
  var _cookie$split = cookie.split("."),
      _cookie$split2 = (0, _slicedToArray2.default)(_cookie$split, 2),
      payload = _cookie$split2[0],
      digest = _cookie$split2[1];

  var decPayload = _encBase.default.parse(payload).toString(_encUtf.default);

  var test = _rememberCookieDigest(decPayload, process.env.REACT_APP_SECRET_KEY);

  if ((0, _util.timingSafeStrEquals)(test, digest)) return decPayload;
};

var _rememberCookieDigest = function _rememberCookieDigest(payload, key) {
  /* Create a keyed hash digest of the supplied payload, using the supplied
  key.
   Returns a Hex encoded hash digest
  */
  var enc = _encUtf.default.parse(payload);

  var digest = (0, _hmacSha.default)(enc, key).toString(_encHex.default);
  return digest;
};