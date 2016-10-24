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
exports.deactivate = deactivate;
exports.consumeProvider = consumeProvider;
exports.observeTextEditor = observeTextEditor;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _Hyperclick;

function _load_Hyperclick() {
  return _Hyperclick = _interopRequireDefault(require('./Hyperclick'));
}

var hyperclick = null;

function activate() {
  hyperclick = new (_Hyperclick || _load_Hyperclick()).default();

  // FB-only: override the symbols-view "Go To Declaration" context menu item
  // with the Hyperclick "confirm-cursor" command.
  // TODO(hansonw): Remove when symbols-view has a proper API.
  try {
    // $FlowFB

    var _require = require('./fb/overrideGoToDeclaration');

    var overrideGoToDeclaration = _require.overrideGoToDeclaration;

    overrideGoToDeclaration();
  } catch (e) {
    // Ignore.
  }
}

function deactivate() {
  if (hyperclick != null) {
    hyperclick.dispose();
    hyperclick = null;
  }
}

function consumeProvider(provider) {
  if (hyperclick != null) {
    hyperclick.consumeProvider(provider);
    return new (_atom || _load_atom()).Disposable(function () {
      if (hyperclick != null) {
        hyperclick.removeProvider(provider);
      }
    });
  }
}

/**
 * A TextEditor whose creation is announced via atom.workspace.observeTextEditors() will be
 * observed by default by hyperclick. However, if a TextEditor is created via some other means,
 * (such as a building block for a piece of UI), then it must be observed explicitly.
 */

function observeTextEditor() {
  return function (textEditor) {
    if (hyperclick != null) {
      hyperclick.observeTextEditor(textEditor);
    }
  };
}