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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var _DebuggerDispatcher;

function _load_DebuggerDispatcher() {
  return _DebuggerDispatcher = require('./DebuggerDispatcher');
}

var _DebuggerStore;

function _load_DebuggerStore() {
  return _DebuggerStore = require('./DebuggerStore');
}

var WatchExpressionListStore = (function () {
  function WatchExpressionListStore(watchExpressionStore, dispatcher) {
    _classCallCheck(this, WatchExpressionListStore);

    this._watchExpressionStore = watchExpressionStore;
    var dispatcherToken = dispatcher.register(this._handlePayload.bind(this));
    this._disposables = new (_atom || _load_atom()).CompositeDisposable(new (_atom || _load_atom()).Disposable(function () {
      dispatcher.unregister(dispatcherToken);
    }));
    this._watchExpressions = new (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).BehaviorSubject([]);
  }

  _createClass(WatchExpressionListStore, [{
    key: '_handlePayload',
    value: function _handlePayload(payload) {
      switch (payload.actionType) {
        case (_DebuggerDispatcher || _load_DebuggerDispatcher()).ActionTypes.ADD_WATCH_EXPRESSION:
          this._addWatchExpression(payload.data.expression);
          break;
        case (_DebuggerDispatcher || _load_DebuggerDispatcher()).ActionTypes.REMOVE_WATCH_EXPRESSION:
          this._removeWatchExpression(payload.data.index);
          break;
        case (_DebuggerDispatcher || _load_DebuggerDispatcher()).ActionTypes.UPDATE_WATCH_EXPRESSION:
          this._updateWatchExpression(payload.data.index, payload.data.newExpression);
          break;
        case (_DebuggerDispatcher || _load_DebuggerDispatcher()).ActionTypes.DEBUGGER_MODE_CHANGE:
          if (payload.data === (_DebuggerStore || _load_DebuggerStore()).DebuggerMode.STARTING) {
            this._refetchWatchSubscriptions();
          }
          break;
        default:
          return;
      }
    }
  }, {
    key: '_getExpressionEvaluationFor',
    value: function _getExpressionEvaluationFor(expression) {
      return {
        expression: expression,
        value: this._watchExpressionStore.evaluateWatchExpression(expression)
      };
    }
  }, {
    key: 'getWatchExpressions',
    value: function getWatchExpressions() {
      return this._watchExpressions.asObservable();
    }
  }, {
    key: '_addWatchExpression',
    value: function _addWatchExpression(expression) {
      this._watchExpressions.next([].concat(_toConsumableArray(this._watchExpressions.getValue()), [this._getExpressionEvaluationFor(expression)]));
    }
  }, {
    key: '_removeWatchExpression',
    value: function _removeWatchExpression(index) {
      var watchExpressions = this._watchExpressions.getValue().slice();
      watchExpressions.splice(index, 1);
      this._watchExpressions.next(watchExpressions);
    }
  }, {
    key: '_updateWatchExpression',
    value: function _updateWatchExpression(index, newExpression) {
      var watchExpressions = this._watchExpressions.getValue().slice();
      watchExpressions[index] = this._getExpressionEvaluationFor(newExpression);
      this._watchExpressions.next(watchExpressions);
    }
  }, {
    key: '_refetchWatchSubscriptions',
    value: function _refetchWatchSubscriptions() {
      var _this = this;

      var watchExpressions = this._watchExpressions.getValue().slice();
      var refetchedWatchExpressions = watchExpressions.map(function (_ref) {
        var expression = _ref.expression;

        return _this._getExpressionEvaluationFor(expression);
      });
      this._watchExpressions.next(refetchedWatchExpressions);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }
  }]);

  return WatchExpressionListStore;
})();

exports.WatchExpressionListStore = WatchExpressionListStore;

/**
 * Treat the underlying EvaluatedExpressionList as immutable.
 */