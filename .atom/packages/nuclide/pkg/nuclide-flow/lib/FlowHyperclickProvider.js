var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _FlowServiceFactory;

function _load_FlowServiceFactory() {
  return _FlowServiceFactory = require('./FlowServiceFactory');
}

var _commonsAtomGoToLocation;

function _load_commonsAtomGoToLocation() {
  return _commonsAtomGoToLocation = require('../../commons-atom/go-to-location');
}

var _constants;

function _load_constants() {
  return _constants = require('./constants');
}

var JS_GRAMMARS_SET = new Set((_constants || _load_constants()).JS_GRAMMARS);

var FlowHyperclickProvider = (function () {
  function FlowHyperclickProvider() {
    _classCallCheck(this, FlowHyperclickProvider);
  }

  _createClass(FlowHyperclickProvider, [{
    key: 'getSuggestionForWord',
    value: _asyncToGenerator(function* (textEditor, text, range) {
      if (!JS_GRAMMARS_SET.has(textEditor.getGrammar().scopeName)) {
        return null;
      }

      var filePath = textEditor.getPath();
      if (filePath == null) {
        return null;
      }
      var position = range.start;

      var flowService = (0, (_FlowServiceFactory || _load_FlowServiceFactory()).getFlowServiceByNuclideUri)(filePath);
      (0, (_assert || _load_assert()).default)(flowService);
      var location = yield flowService.flowFindDefinition(filePath, textEditor.getText(), position.row + 1, position.column + 1);
      if (location) {
        return {
          range: range,
          callback: function callback() {
            (0, (_commonsAtomGoToLocation || _load_commonsAtomGoToLocation()).goToLocation)(location.file, location.point.line, location.point.column);
          }
        };
      } else {
        return null;
      }
    })
  }]);

  return FlowHyperclickProvider;
})();

module.exports = FlowHyperclickProvider;