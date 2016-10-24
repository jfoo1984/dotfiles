Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _settings;

function _load_settings() {
  return _settings = require('./settings');
}

var _utils;

function _load_utils() {
  return _utils = require('./utils');
}

var _utils2;

function _load_utils2() {
  return _utils2 = _interopRequireDefault(require('./utils'));
}

var _helpers;

function _load_helpers() {
  return _helpers = require('./helpers');
}

var _Handler;

function _load_Handler() {
  return _Handler = _interopRequireDefault(require('./Handler'));
}

var _frame;

function _load_frame() {
  return _frame = require('./frame');
}

var _DbgpSocket;

function _load_DbgpSocket() {
  return _DbgpSocket = require('./DbgpSocket');
}

var _ConnectionMultiplexerJs;

function _load_ConnectionMultiplexerJs() {
  return _ConnectionMultiplexerJs = require('./ConnectionMultiplexer.js');
}

var _FileCache;

function _load_FileCache() {
  return _FileCache = _interopRequireDefault(require('./FileCache'));
}

var _events;

function _load_events() {
  return _events = _interopRequireDefault(require('events'));
}

var _eventKit;

function _load_eventKit() {
  return _eventKit = require('event-kit');
}

var SESSION_END_EVENT = 'session-end-event';

// Handles all 'Debug.*' Chrome dev tools messages

var DebuggerHandler = (function (_default) {
  _inherits(DebuggerHandler, _default);

  function DebuggerHandler(clientCallback, connectionMultiplexer) {
    _classCallCheck(this, DebuggerHandler);

    _get(Object.getPrototypeOf(DebuggerHandler.prototype), 'constructor', this).call(this, 'Debugger', clientCallback);

    this._hadFirstContinuationCommand = false;
    this._connectionMultiplexer = connectionMultiplexer;
    this._files = new (_FileCache || _load_FileCache()).default(clientCallback);
    this._emitter = new (_events || _load_events()).default();
    this._subscriptions = new (_eventKit || _load_eventKit()).CompositeDisposable(this._connectionMultiplexer.onStatus(this._onStatusChanged.bind(this)), this._connectionMultiplexer.onNotification(this._onNotification.bind(this)));
  }

  _createClass(DebuggerHandler, [{
    key: 'onSessionEnd',
    value: function onSessionEnd(callback) {
      (_utils2 || _load_utils2()).default.log('onSessionEnd');
      this._emitter.on(SESSION_END_EVENT, callback);
    }
  }, {
    key: 'handleMethod',
    value: _asyncToGenerator(function* (id, method, params) {

      switch (method) {

        // TODO: Add Console (aka logging) support
        case 'enable':
          this._debuggerEnable(id);
          break;

        case 'pause':
          this._pause();
          break;

        case 'stepInto':
          this._sendContinuationCommand((_DbgpSocket || _load_DbgpSocket()).COMMAND_STEP_INTO);
          break;

        case 'stepOut':
          this._sendContinuationCommand((_DbgpSocket || _load_DbgpSocket()).COMMAND_STEP_OUT);
          break;

        case 'stepOver':
          this._sendContinuationCommand((_DbgpSocket || _load_DbgpSocket()).COMMAND_STEP_OVER);
          break;

        case 'resume':
          this._resume();
          break;

        case 'setPauseOnExceptions':
          yield this._setPauseOnExceptions(id, params);
          break;

        case 'setAsyncCallStackDepth':
        case 'skipStackFrames':
          this.replyWithError(id, 'Not implemented');
          break;

        case 'getScriptSource':
          // TODO: Handle file read errors.
          // TODO: Handle non-file scriptIds
          this.replyToCommand(id, { scriptSource: yield this._files.getFileSource(params.scriptId) });
          break;

        case 'setBreakpointByUrl':
          this._setBreakpointByUrl(id, params);
          break;

        case 'removeBreakpoint':
          yield this._removeBreakpoint(id, params);
          break;

        case 'evaluateOnCallFrame':
          var compatParams = (0, (_utils || _load_utils()).makeExpressionHphpdCompatible)(params);
          var result = yield this._connectionMultiplexer.evaluateOnCallFrame(Number(compatParams.callFrameId), compatParams.expression);
          this.replyToCommand(id, result);
          break;

        case 'selectThread':
          this._selectThread(params);
          break;

        case 'setDebuggerSettings':
          (0, (_settings || _load_settings()).updateSettings)(params);
          break;

        default:
          this.unknownMethod(id, method, params);
          break;
      }
    })
  }, {
    key: '_selectThread',
    value: _asyncToGenerator(function* (params) {
      var threadId = params.threadId;

      yield this._connectionMultiplexer.selectThread(threadId);
      this._sendPausedMessage();
    })
  }, {
    key: '_setPauseOnExceptions',
    value: _asyncToGenerator(function* (id, params) {
      var state = params.state;

      yield this._connectionMultiplexer.getBreakpointStore().setPauseOnExceptions(String(id), state);
      this.replyToCommand(id, {});
    })
  }, {
    key: '_setBreakpointByUrl',
    value: _asyncToGenerator(function* (id, params) {
      var lineNumber = params.lineNumber;
      var url = params.url;
      var columnNumber = params.columnNumber;
      var condition = params.condition;

      if (!url || columnNumber !== 0) {
        this.replyWithError(id, 'Invalid arguments to Debugger.setBreakpointByUrl: ' + JSON.stringify(params));
        return;
      }
      this._files.registerFile(url);

      var path = (0, (_helpers || _load_helpers()).uriToPath)(url);
      var breakpointStore = this._connectionMultiplexer.getBreakpointStore();
      // Chrome lineNumber is 0-based while xdebug lineno is 1-based.
      var breakpointId = yield breakpointStore.setFileLineBreakpoint(String(id), path, lineNumber + 1, condition);
      var breakpoint = yield breakpointStore.getBreakpoint(breakpointId);
      (0, (_assert || _load_assert()).default)(breakpoint != null);
      this.replyToCommand(id, {
        breakpointId: breakpointId,
        resolved: breakpoint.resolved,
        locations: [(0, (_helpers || _load_helpers()).getBreakpointLocation)(breakpoint)]
      });
    })
  }, {
    key: '_removeBreakpoint',
    value: _asyncToGenerator(function* (id, params) {
      var breakpointId = params.breakpointId;

      yield this._connectionMultiplexer.removeBreakpoint(breakpointId);
      this.replyToCommand(id, { id: breakpointId });
    })
  }, {
    key: '_debuggerEnable',
    value: function _debuggerEnable(id) {
      this.replyToCommand(id, {});
      this._sendFakeLoaderBreakpoint();
    }
  }, {
    key: '_getStackFrames',
    value: _asyncToGenerator(function* () {
      var _this = this;

      var frames = yield this._connectionMultiplexer.getStackFrames();
      return yield Promise.all(frames.stack.map(function (frame, frameIndex) {
        return _this._convertFrame(frame, frameIndex);
      }));
    })
  }, {
    key: '_getTopFrameForConnection',
    value: _asyncToGenerator(function* (id) {
      var frames = yield this._connectionMultiplexer.getConnectionStackFrames(id);
      return yield this._convertFrame(frames.stack[0], 0);
    })
  }, {
    key: '_convertFrame',
    value: _asyncToGenerator(function* (frame, frameIndex) {
      (_utils2 || _load_utils2()).default.log('Converting frame: ' + JSON.stringify(frame));
      var file = this._files.registerFile((0, (_frame || _load_frame()).fileUrlOfFrame)(frame));
      var location = (0, (_frame || _load_frame()).locationOfFrame)(frame);
      var hasSource = yield file.hasSource();
      if (!hasSource) {
        location.scriptId = '';
      }
      return {
        callFrameId: (0, (_frame || _load_frame()).idOfFrame)(frame),
        functionName: (0, (_frame || _load_frame()).functionOfFrame)(frame),
        location: location,
        scopeChain: yield this._connectionMultiplexer.getScopesForFrame(frameIndex)
      };
    })
  }, {
    key: '_sendContinuationCommand',
    value: function _sendContinuationCommand(command) {
      (_utils2 || _load_utils2()).default.log('Sending continuation command: ' + command);
      this._connectionMultiplexer.sendContinuationCommand(command);
    }
  }, {
    key: '_pause',
    value: function _pause() {
      this._connectionMultiplexer.pause();
    }
  }, {
    key: '_resume',
    value: function _resume() {
      if (!this._hadFirstContinuationCommand) {
        this._hadFirstContinuationCommand = true;
        this.sendMethod('Debugger.resumed');
        this._connectionMultiplexer.listen();
        return;
      }
      this._connectionMultiplexer.resume();
    }
  }, {
    key: '_onStatusChanged',
    value: _asyncToGenerator(function* (status, params) {
      (_utils2 || _load_utils2()).default.log('Sending status: ' + status);
      switch (status) {
        case (_ConnectionMultiplexerJs || _load_ConnectionMultiplexerJs()).MULTIPLEXER_STATUS.ALL_CONNECTIONS_BREAK:
        case (_ConnectionMultiplexerJs || _load_ConnectionMultiplexerJs()).MULTIPLEXER_STATUS.BREAK:
          yield this._sendPausedMessage();
          break;
        case (_ConnectionMultiplexerJs || _load_ConnectionMultiplexerJs()).MULTIPLEXER_STATUS.RUNNING:
          this.sendMethod('Debugger.resumed');
          break;
        case (_ConnectionMultiplexerJs || _load_ConnectionMultiplexerJs()).MULTIPLEXER_STATUS.END:
          this._endSession();
          break;
        default:
          (_utils2 || _load_utils2()).default.logErrorAndThrow('Unexpected status: ' + status);
      }
    })
  }, {
    key: '_onNotification',
    value: _asyncToGenerator(function* (notifyName, params) {
      switch (notifyName) {
        case (_DbgpSocket || _load_DbgpSocket()).BREAKPOINT_RESOLVED_NOTIFICATION:
          (0, (_assert || _load_assert()).default)(params);
          var breakpoint = params;
          this.sendMethod('Debugger.breakpointResolved', {
            breakpointId: breakpoint.chromeId,
            location: (0, (_helpers || _load_helpers()).getBreakpointLocation)(breakpoint)
          });
          break;
        case (_ConnectionMultiplexerJs || _load_ConnectionMultiplexerJs()).CONNECTION_MUX_NOTIFICATION.REQUEST_UPDATE:
          (0, (_assert || _load_assert()).default)(params);
          var frame = params.status === (_DbgpSocket || _load_DbgpSocket()).CONNECTION_STATUS.BREAK ? (yield this._getTopFrameForConnection(params.id)) : null;
          this.sendMethod('Debugger.threadUpdated', {
            thread: {
              id: String(params.id),
              name: String(params.id),
              address: frame != null ? frame.functionName : 'N/A',
              location: frame != null ? frame.location : null,
              hasSource: true,
              stopReason: params.stopReason,
              description: 'N/A'
            }
          });
          break;
        default:
          (_utils2 || _load_utils2()).default.logErrorAndThrow('Unexpected notification: ' + notifyName);
      }
    })

    // May only call when in paused state.
  }, {
    key: '_sendPausedMessage',
    value: _asyncToGenerator(function* () {
      var requestSwitchMessage = this._connectionMultiplexer.getRequestSwitchMessage();
      this._connectionMultiplexer.resetRequestSwitchMessage();
      if (requestSwitchMessage != null) {
        this.sendUserMessage('outputWindow', {
          level: 'info',
          text: requestSwitchMessage
        });
      }
      this.sendMethod('Debugger.paused', {
        callFrames: yield this._getStackFrames(),
        reason: 'breakpoint', // TODO: better reason?
        threadSwitchMessage: requestSwitchMessage,
        data: {},
        stopThreadId: this._connectionMultiplexer.getEnabledConnectionId()
      });
    })
  }, {
    key: '_sendFakeLoaderBreakpoint',
    value: function _sendFakeLoaderBreakpoint() {
      this.sendMethod('Debugger.paused', {
        callFrames: [],
        reason: 'breakpoint', // TODO: better reason?
        data: {}
      });
    }
  }, {
    key: '_endSession',
    value: function _endSession() {
      (_utils2 || _load_utils2()).default.log('DebuggerHandler: Ending session');
      this._subscriptions.dispose();
      this._emitter.emit(SESSION_END_EVENT);
    }
  }]);

  return DebuggerHandler;
})((_Handler || _load_Handler()).default);

exports.DebuggerHandler = DebuggerHandler;