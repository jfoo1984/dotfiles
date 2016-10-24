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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _LaunchAttachDispatcher;

function _load_LaunchAttachDispatcher() {
  return _LaunchAttachDispatcher = require('./LaunchAttachDispatcher');
}

var ATTACH_TARGET_LIST_CHANGE_EVENT = 'ATTACH_TARGET_LIST_CHANGE_EVENT';

var LaunchAttachStore = (function () {
  function LaunchAttachStore(dispatcher) {
    _classCallCheck(this, LaunchAttachStore);

    this._dispatcher = dispatcher;
    this._dispatcherToken = this._dispatcher.register(this._handleActions.bind(this));
    this._emitter = new (_atom || _load_atom()).Emitter();
    this._attachTargetInfos = [];
  }

  _createClass(LaunchAttachStore, [{
    key: 'dispose',
    value: function dispose() {
      this._dispatcher.unregister(this._dispatcherToken);
    }
  }, {
    key: 'onAttachTargetListChanged',
    value: function onAttachTargetListChanged(callback) {
      return this._emitter.on(ATTACH_TARGET_LIST_CHANGE_EVENT, callback);
    }
  }, {
    key: '_handleActions',
    value: function _handleActions(action) {
      switch (action.actionType) {
        case (_LaunchAttachDispatcher || _load_LaunchAttachDispatcher()).ActionTypes.UPDATE_ATTACH_TARGET_LIST:
          this._attachTargetInfos = action.attachTargetInfos;
          this._emitter.emit(ATTACH_TARGET_LIST_CHANGE_EVENT);
          break;
      }
    }
  }, {
    key: 'getAttachTargetInfos',
    value: function getAttachTargetInfos() {
      return this._attachTargetInfos;
    }
  }]);

  return LaunchAttachStore;
})();

exports.LaunchAttachStore = LaunchAttachStore;