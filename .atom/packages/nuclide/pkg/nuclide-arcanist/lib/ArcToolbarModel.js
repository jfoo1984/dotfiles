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

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var TASKS = [];

exports.TASKS = TASKS;
/*
 * This will provide the toolbar functionality for the open-source-supported HHVM targets.
 * e.g. HHVM Debugger
 */

var ArcToolbarModel = (function () {
  function ArcToolbarModel(outputMessages) {
    _classCallCheck(this, ArcToolbarModel);

    this._outputMessages = outputMessages;
  }

  _createClass(ArcToolbarModel, [{
    key: 'setCwdApi',
    value: function setCwdApi(cwdApi) {
      this._cwdApi = cwdApi;
    }
  }, {
    key: 'logOutput',
    value: function logOutput(text, level) {
      this._outputMessages.next({ text: text, level: level });
    }
  }, {
    key: 'getActiveProjectPath',
    value: function getActiveProjectPath() {
      if (this._cwdApi == null) {
        return atom.project.getPaths()[0];
      }
      var workingDirectory = this._cwdApi.getCwd();
      if (workingDirectory != null) {
        return workingDirectory.getPath();
      } else {
        return null;
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(callback) {
      return new (_atom || _load_atom()).Disposable(function () {});
    }
  }, {
    key: 'setActiveBuildTarget',
    value: function setActiveBuildTarget(value) {
      throw new Error('arc build targets not supported');
    }
  }, {
    key: 'isArcSupported',
    value: function isArcSupported() {
      return false;
    }
  }, {
    key: 'getActiveBuildTarget',
    value: function getActiveBuildTarget() {
      return '';
    }
  }, {
    key: 'getName',
    value: function getName() {
      return 'Arcanist';
    }
  }, {
    key: 'getTaskList',
    value: function getTaskList() {
      return TASKS;
    }
  }, {
    key: 'arcBuild',
    value: _asyncToGenerator(function* () {
      throw new Error('arc build not supported');
    })
  }, {
    key: 'getBuildTargets',
    value: function getBuildTargets() {
      throw new Error('arc build not supported');
    }
  }, {
    key: 'updateBuildTargets',
    value: function updateBuildTargets() {
      throw new Error('arc build not supported');
    }
  }, {
    key: 'getBuildTargetsError',
    value: function getBuildTargetsError() {
      throw new Error('arc build not supported');
    }
  }, {
    key: 'viewActivated',
    value: function viewActivated() {
      throw new Error('arc build not supported');
    }
  }, {
    key: 'viewDeactivated',
    value: function viewDeactivated() {
      throw new Error('arc build not supported');
    }
  }]);

  return ArcToolbarModel;
})();

exports.ArcToolbarModel = ArcToolbarModel;