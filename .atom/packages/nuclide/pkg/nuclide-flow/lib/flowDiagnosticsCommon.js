Object.defineProperty(exports, '__esModule', {
  value: true
});

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

exports.extractRange = extractRange;

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

// Use `atom$Range | void` rather than `?atom$Range` to exclude `null`, so that the type is
// compatible with the `range` property, which is an optional property rather than a nullable
// property.

function extractRange(message) {
  // It's unclear why the 1-based to 0-based indexing works the way that it
  // does, but this has the desired effect in the UI, in practice.
  var range = message.range;
  if (range == null) {
    return undefined;
  } else {
    return new (_atom || _load_atom()).Range([range.start.line - 1, range.start.column - 1], [range.end.line - 1, range.end.column]);
  }
}