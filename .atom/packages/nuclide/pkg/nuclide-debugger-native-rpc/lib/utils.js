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

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var DEBUGGER_LOGGER_CATEGORY = 'nuclide-debugger-native-rpc';

exports.default = (0, (_nuclideLogging || _load_nuclideLogging()).getCategoryLogger)(DEBUGGER_LOGGER_CATEGORY);
module.exports = exports.default;