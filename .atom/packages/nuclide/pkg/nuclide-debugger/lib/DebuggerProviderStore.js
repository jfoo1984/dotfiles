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

var _DebuggerDispatcher;

function _load_DebuggerDispatcher() {
  return _DebuggerDispatcher = require('./DebuggerDispatcher');
}

var CONNECTIONS_UPDATED_EVENT = 'CONNECTIONS_UPDATED_EVENT';

/**
 * Flux style store holding all data related to debugger provider.
 */

var DebuggerProviderStore = (function () {
  function DebuggerProviderStore(dispatcher, debuggerActions) {
    _classCallCheck(this, DebuggerProviderStore);

    this._dispatcher = dispatcher;
    this._disposables = new (_atom || _load_atom()).CompositeDisposable(this._registerDispatcherEvents(), this._listenForProjectChange());
    this._debuggerActions = debuggerActions;
    this._emitter = new (_atom || _load_atom()).Emitter();
    this._debuggerProviders = new Set();
    this._connections = [];
  }

  _createClass(DebuggerProviderStore, [{
    key: '_registerDispatcherEvents',
    value: function _registerDispatcherEvents() {
      var _this = this;

      var dispatcherToken = this._dispatcher.register(this._handlePayload.bind(this));
      return new (_atom || _load_atom()).Disposable(function () {
        return _this._dispatcher.unregister(dispatcherToken);
      });
    }
  }, {
    key: '_listenForProjectChange',
    value: function _listenForProjectChange() {
      var _this2 = this;

      return atom.project.onDidChangePaths(function () {
        _this2._debuggerActions.updateConnections();
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }

    /**
     * Subscribe to new connection updates from DebuggerActions.
     */
  }, {
    key: 'onConnectionsUpdated',
    value: function onConnectionsUpdated(callback) {
      return this._emitter.on(CONNECTIONS_UPDATED_EVENT, callback);
    }
  }, {
    key: 'getConnections',
    value: function getConnections() {
      return this._connections;
    }

    /**
     * Return available launch/attach provider for input connection.
     * Caller is responsible for disposing the results.
     */
  }, {
    key: 'getLaunchAttachProvidersForConnection',
    value: function getLaunchAttachProvidersForConnection(connection) {
      var availableLaunchAttachProviders = [];
      for (var provider of this._debuggerProviders) {
        var launchAttachProvider = provider.getLaunchAttachProvider(connection);
        if (launchAttachProvider != null) {
          availableLaunchAttachProviders.push(launchAttachProvider);
        }
      }
      return availableLaunchAttachProviders;
    }
  }, {
    key: '_handlePayload',
    value: function _handlePayload(payload) {
      switch (payload.actionType) {
        case (_DebuggerDispatcher || _load_DebuggerDispatcher()).ActionTypes.ADD_DEBUGGER_PROVIDER:
          if (this._debuggerProviders.has(payload.data)) {
            return;
          }
          this._debuggerProviders.add(payload.data);
          break;
        case (_DebuggerDispatcher || _load_DebuggerDispatcher()).ActionTypes.REMOVE_DEBUGGER_PROVIDER:
          if (!this._debuggerProviders.has(payload.data)) {
            return;
          }
          this._debuggerProviders.delete(payload.data);
          break;
        case (_DebuggerDispatcher || _load_DebuggerDispatcher()).ActionTypes.UPDATE_CONNECTIONS:
          this._connections = payload.data;
          this._emitter.emit(CONNECTIONS_UPDATED_EVENT);
          break;
      }
    }
  }]);

  return DebuggerProviderStore;
})();

exports.DebuggerProviderStore = DebuggerProviderStore;