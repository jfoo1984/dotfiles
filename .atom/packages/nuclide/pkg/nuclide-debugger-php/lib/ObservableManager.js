Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _nuclideDebuggerBase;

function _load_nuclideDebuggerBase() {
  return _nuclideDebuggerBase = require('../../nuclide-debugger-base');
}

var _utils;

function _load_utils() {
  return _utils = _interopRequireDefault(require('./utils'));
}

var _default = (_utils || _load_utils()).default;

var log = _default.log;
var logError = _default.logError;

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var _commonsNodeUniversalDisposable;

function _load_commonsNodeUniversalDisposable() {
  return _commonsNodeUniversalDisposable = _interopRequireDefault(require('../../commons-node/UniversalDisposable'));
}

/**
 * The ObservableManager keeps track of the streams we use to talk to the server-side nuclide
 * debugger.  Currently it manages 3 streams:
 *   1. A notification stream to communicate events to atom's notification system.
 *   2. A server message stream to communicate events to the debugger UI.
 *   3. An output window stream to communicate events to the client's output window.
 * The manager also allows two callback to be passed.
 *   1. sendServerMessageToChromeUi takes a string and sends it to the chrome debugger UI.
 *   2. onSessionEnd is optional, and is called when all the managed observables complete.
 * The ObservableManager takes ownership of its observables, and disposes them when its dispose
 * method is called.
 */

var ObservableManager = (function () {
  function ObservableManager(notifications, serverMessages, outputWindowMessages, sendServerMessageToChromeUi, onSessionEnd) {
    _classCallCheck(this, ObservableManager);

    this._notifications = notifications;
    this._serverMessages = serverMessages;
    this._outputWindowMessages = outputWindowMessages;
    this._sendServerMessageToChromeUi = sendServerMessageToChromeUi;
    this._onSessionEnd = onSessionEnd;
    this._disposables = new (_commonsNodeUniversalDisposable || _load_commonsNodeUniversalDisposable()).default();
    this._subscribe();
  }

  _createClass(ObservableManager, [{
    key: '_subscribe',
    value: function _subscribe() {
      var sharedNotifications = this._notifications.share();
      this._disposables.add(sharedNotifications.subscribe(this._handleNotificationMessage.bind(this), this._handleNotificationError.bind(this), this._handleNotificationEnd.bind(this)));
      var sharedServerMessages = this._serverMessages.share();
      this._disposables.add(sharedServerMessages.subscribe(this._handleServerMessage.bind(this), this._handleServerError.bind(this), this._handleServerEnd.bind(this)));
      var sharedOutputWindow = this._outputWindowMessages.share();
      this._registerOutputWindowLogging(sharedOutputWindow);
      (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.merge(sharedNotifications, sharedServerMessages, sharedOutputWindow).subscribe({
        complete: this._onCompleted.bind(this)
      });
    }
  }, {
    key: '_registerOutputWindowLogging',
    value: function _registerOutputWindowLogging(sharedOutputWindowMessages) {
      var api = (0, (_nuclideDebuggerBase || _load_nuclideDebuggerBase()).getOutputService)();
      if (api != null) {
        var messages = sharedOutputWindowMessages.filter(function (messageObj) {
          return messageObj.method === 'Console.messageAdded';
        }).map(function (messageObj) {
          return {
            level: messageObj.params.message.level,
            text: messageObj.params.message.text
          };
        });
        this._disposables.add(sharedOutputWindowMessages.subscribe({
          complete: this._handleOutputWindowEnd.bind(this)
        }), api.registerOutputProvider({
          id: 'hhvm debugger',
          messages: messages
        }));
      } else {
        logError('Cannot get output window service.');
      }
    }
  }, {
    key: '_handleOutputWindowEnd',
    value: function _handleOutputWindowEnd() {
      log('Output window observable ended.');
    }
  }, {
    key: '_handleNotificationMessage',
    value: function _handleNotificationMessage(message) {
      switch (message.type) {
        case 'info':
          log('Notification observerable info: ' + message.message);
          atom.notifications.addInfo(message.message);
          break;

        case 'warning':
          log('Notification observerable warning: ' + message.message);
          atom.notifications.addWarning(message.message);
          break;

        case 'error':
          logError('Notification observerable error: ' + message.message);
          atom.notifications.addError(message.message);
          break;

        case 'fatalError':
          logError('Notification observerable fatal error: ' + message.message);
          atom.notifications.addFatalError(message.message);
          break;

        default:
          logError('Unknown message: ' + JSON.stringify(message));
          break;
      }
    }
  }, {
    key: '_handleNotificationError',
    value: function _handleNotificationError(error) {
      logError('Notification observerable error: ' + error);
    }
  }, {
    key: '_handleNotificationEnd',
    value: function _handleNotificationEnd() {
      log('Notification observerable ends.');
    }
  }, {
    key: '_handleServerMessage',
    value: function _handleServerMessage(message) {
      log('Recieved server message: ' + message);
      this._sendServerMessageToChromeUi(message);
    }
  }, {
    key: '_handleServerError',
    value: function _handleServerError(error) {
      logError('Received server error: ' + error);
    }
  }, {
    key: '_handleServerEnd',
    value: function _handleServerEnd() {
      log('Server observerable ends.');
    }
  }, {
    key: '_onCompleted',
    value: function _onCompleted() {
      if (this._onSessionEnd != null) {
        this._onSessionEnd();
      }
      log('All observable streams have completed and session end callback was called.');
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }
  }]);

  return ObservableManager;
})();

exports.ObservableManager = ObservableManager;