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

var _nuclideRemoteConnection;

function _load_nuclideRemoteConnection() {
  return _nuclideRemoteConnection = require('../../nuclide-remote-connection');
}

var _config;

function _load_config() {
  return _config = require('./config');
}

var _outline;

function _load_outline() {
  return _outline = require('./outline');
}

var OutlineHelpers = (function () {
  function OutlineHelpers() {
    _classCallCheck(this, OutlineHelpers);
  }

  _createClass(OutlineHelpers, null, [{
    key: 'getOutline',
    value: _asyncToGenerator(function* (editor) {
      var src = editor.getPath();
      if (!src) {
        return null;
      }
      var contents = editor.getText();
      var mode = (0, (_config || _load_config()).getShowGlobalVariables)() ? 'all' : 'constants';

      var service = yield (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getServiceByNuclideUri)('PythonService', src);
      if (!service) {
        return null;
      }

      var items = yield service.getOutline(src, contents);
      if (items == null) {
        return null;
      }

      return {
        outlineTrees: (0, (_outline || _load_outline()).itemsToOutline)(mode, items)
      };
    })
  }]);

  return OutlineHelpers;
})();

exports.default = OutlineHelpers;
module.exports = exports.default;