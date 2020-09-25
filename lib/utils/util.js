"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timingSafeStrEquals = timingSafeStrEquals;

function timingSafeStrEquals(a, b) {
  var diff = 0;

  for (var i = 0; i < a.length; ++i) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return diff === 0;
}