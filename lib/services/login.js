"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestBearer = exports.loginBasic = exports.login = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

require("regenerator-runtime/runtime");

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _jsonwebtoken = require("jsonwebtoken");

var _cookie = require("./cookie");

var login = function login(type, authObj) {
  switch (type) {
    case "Basic":
      return loginBasic(authObj.user, authObj.pw);

    case "Bearer":
      return requestBearer(authObj);
  }
};

exports.login = login;

var loginBasic = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(user, pw) {
    var loginBase, requestOpts, resp, respJson, verified;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            loginBase = btoa("".concat(user, ":").concat(pw));
            requestOpts = {
              method: "POST",
              headers: {
                Authorization: "Basic ".concat(loginBase)
              }
            };
            _context.next = 4;
            return fetch(process.env.REACT_APP_TOKEN_ENDPOINT, requestOpts);

          case 4:
            resp = _context.sent;
            _context.next = 7;
            return resp.json();

          case 7:
            respJson = _context.sent;
            _context.prev = 8;
            _context.next = 11;
            return verifyJWT(respJson.token);

          case 11:
            verified = _context.sent;

            if (!verified) {
              _context.next = 15;
              break;
            }

            (0, _cookie.setRememberCookie)(verified[process.env.REACT_APP_USER_DESCRIPTOR]);
            return _context.abrupt("return", respJson);

          case 15:
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](8);
            console.log(_context.t0);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[8, 17]]);
  }));

  return function loginBasic(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.loginBasic = loginBasic;

var requestBearer = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(jwt, endpoint) {
    var requestOpts, resp;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            requestOpts = {
              method: "GET",
              headers: {
                Authorization: "Bearer ".concat(jwt)
              }
            };
            _context2.next = 3;
            return fetch(endpoint, requestOpts);

          case 3:
            resp = _context2.sent;
            _context2.next = 6;
            return resp.json();

          case 6:
            return _context2.abrupt("return", _context2.sent);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function requestBearer(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.requestBearer = requestBearer;

var verifyJWT = function verifyJWT(token) {
  return new Promise(function (resolve, error) {
    try {
      var jwtArr = token.split(".");
      var algHeader = JSON.parse(atob(jwtArr[0]));
      var decoded = (0, _jsonwebtoken.verify)(token, process.env.REACT_APP_SECRET_KEY, {
        algorithms: algHeader.alg
      });
      resolve(decoded);
    } catch (err) {
      error(err);
    }
  });
};