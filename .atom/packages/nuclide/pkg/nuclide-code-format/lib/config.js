Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getFormatOnSave = getFormatOnSave;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _commonsAtomFeatureConfig;

function _load_commonsAtomFeatureConfig() {
  return _commonsAtomFeatureConfig = _interopRequireDefault(require('../../commons-atom/featureConfig'));
}

function getFormatOnSave() {
  var formatOnSave = (_commonsAtomFeatureConfig || _load_commonsAtomFeatureConfig()).default.get('nuclide-code-format.formatOnSave');
  return formatOnSave == null ? false : formatOnSave;
}