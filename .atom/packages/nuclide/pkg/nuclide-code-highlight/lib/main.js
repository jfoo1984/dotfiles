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

exports.activate = activate;
exports.consumeProvider = consumeProvider;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _CodeHighlightManager;

function _load_CodeHighlightManager() {
  return _CodeHighlightManager = _interopRequireDefault(require('./CodeHighlightManager'));
}

var codeHighlightManager = null;

function activate(state) {
  codeHighlightManager = new (_CodeHighlightManager || _load_CodeHighlightManager()).default();
}

function consumeProvider(provider) {
  (0, (_assert || _load_assert()).default)(codeHighlightManager != null);
  codeHighlightManager.addProvider(provider);
}

function deactivate() {
  (0, (_assert || _load_assert()).default)(codeHighlightManager != null);
  codeHighlightManager.dispose();
  codeHighlightManager = null;
}