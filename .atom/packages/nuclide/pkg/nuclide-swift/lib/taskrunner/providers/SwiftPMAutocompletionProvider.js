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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _SwiftPMTaskRunnerStore;

function _load_SwiftPMTaskRunnerStore() {
  return _SwiftPMTaskRunnerStore = _interopRequireDefault(require('../SwiftPMTaskRunnerStore'));
}

var _sourcekittenSourceKitten;

function _load_sourcekittenSourceKitten() {
  return _sourcekittenSourceKitten = require('../../sourcekitten/SourceKitten');
}

var _sourcekittenComplete;

function _load_sourcekittenComplete() {
  return _sourcekittenComplete = _interopRequireDefault(require('../../sourcekitten/Complete'));
}

/**
 * An autocompletion provider that uses the compile commands in a built Swift
 * package's debug.yaml or release.yaml.
 */

var SwiftPMAutocompletionProvider = (function () {
  function SwiftPMAutocompletionProvider(store) {
    _classCallCheck(this, SwiftPMAutocompletionProvider);

    this._store = store;
  }

  _createClass(SwiftPMAutocompletionProvider, [{
    key: 'getAutocompleteSuggestions',
    value: _asyncToGenerator(function* (request) {
      var filePath = request.editor.getPath();
      var compilerArgs = undefined;
      if (filePath) {
        var commands = yield this._store.getCompileCommands();
        compilerArgs = commands.get(filePath);
      }

      var bufferPosition = request.bufferPosition;
      var editor = request.editor;
      var prefix = request.prefix;

      var offset = editor.getBuffer().characterIndexForPosition(bufferPosition) - prefix.length;
      var result = yield (0, (_sourcekittenSourceKitten || _load_sourcekittenSourceKitten()).asyncExecuteSourceKitten)('complete', ['--text', request.editor.getText(), '--offset', String(offset), '--', compilerArgs ? compilerArgs : '']);

      if (!result) {
        return [];
      }

      return JSON.parse(result).filter(function (completion) {
        return completion.name.startsWith(prefix);
      }).map((_sourcekittenComplete || _load_sourcekittenComplete()).default);
    })
  }]);

  return SwiftPMAutocompletionProvider;
})();

exports.default = SwiftPMAutocompletionProvider;
module.exports = exports.default;