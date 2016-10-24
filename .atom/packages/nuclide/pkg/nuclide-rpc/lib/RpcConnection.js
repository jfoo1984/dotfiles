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

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var _ServiceRegistry;

function _load_ServiceRegistry() {
  return _ServiceRegistry = require('./ServiceRegistry');
}

var _ObjectRegistry;

function _load_ObjectRegistry() {
  return _ObjectRegistry = require('./ObjectRegistry');
}

var _messages;

function _load_messages() {
  return _messages = require('./messages');
}

var _builtinTypes;

function _load_builtinTypes() {
  return _builtinTypes = require('./builtin-types');
}

var _nuclideAnalytics;

function _load_nuclideAnalytics() {
  return _nuclideAnalytics = require('../../nuclide-analytics');
}

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var logger = (0, (_nuclideLogging || _load_nuclideLogging()).getLogger)();

var SERVICE_FRAMEWORK_RPC_TIMEOUT_MS = 60 * 1000;

var Subscription = (function () {
  function Subscription(message, observer) {
    _classCallCheck(this, Subscription);

    this._message = message;
    this._observer = observer;
  }

  _createClass(Subscription, [{
    key: 'error',
    value: (function (_error) {
      function error(_x) {
        return _error.apply(this, arguments);
      }

      error.toString = function () {
        return _error.toString();
      };

      return error;
    })(function (error) {
      try {
        this._observer.error((0, (_messages || _load_messages()).decodeError)(this._message, error));
      } catch (e) {
        logger.error('Caught exception in Subscription.error: ' + e.toString());
      }
    })
  }, {
    key: 'next',
    value: function next(data) {
      try {
        this._observer.next(data);
      } catch (e) {
        logger.error('Caught exception in Subscription.next: ' + e.toString());
      }
    }
  }, {
    key: 'complete',
    value: function complete() {
      try {
        this._observer.complete();
      } catch (e) {
        logger.error('Caught exception in Subscription.complete: ' + e.toString());
      }
    }
  }]);

  return Subscription;
})();

var Call = (function () {
  function Call(message, timeoutMessage, resolve, reject, cleanup) {
    var _this = this;

    _classCallCheck(this, Call);

    this._message = message;
    this._timeoutMessage = timeoutMessage;
    this._resolve = resolve;
    this._reject = reject;
    this._cleanup = cleanup;
    this._complete = false;
    this._timerId = setTimeout(function () {
      _this._timeout();
    }, SERVICE_FRAMEWORK_RPC_TIMEOUT_MS);
  }

  _createClass(Call, [{
    key: 'reject',
    value: function reject(error) {
      if (!this._complete) {
        this.cleanup();
        this._reject((0, (_messages || _load_messages()).decodeError)(this._message, error));
      }
    }
  }, {
    key: 'resolve',
    value: function resolve(result) {
      if (!this._complete) {
        this.cleanup();
        this._resolve(result);
      }
    }
  }, {
    key: 'cleanup',
    value: function cleanup() {
      if (!this._complete) {
        this._complete = true;
        clearTimeout(this._timerId);
        this._timerId = null;
        this._cleanup();
      }
    }
  }, {
    key: '_timeout',
    value: function _timeout() {
      if (!this._complete) {
        this.cleanup();
        this._reject(new Error('Timeout after ' + SERVICE_FRAMEWORK_RPC_TIMEOUT_MS + ' for id: ' + (this._message.id + ', ' + this._timeoutMessage + '.')));
      }
    }
  }]);

  return Call;
})();

var RpcConnection = (function () {

  // Do not call this directly, use factory methods below.

  function RpcConnection(kind, serviceRegistry, transport) {
    var _this2 = this;

    _classCallCheck(this, RpcConnection);

    this._transport = transport;
    this._rpcRequestId = 1;
    this._serviceRegistry = serviceRegistry;
    this._objectRegistry = new (_ObjectRegistry || _load_ObjectRegistry()).ObjectRegistry(kind, this._serviceRegistry, this);
    this._transport.onMessage().subscribe(function (message) {
      _this2._handleMessage(message);
    });
    this._subscriptions = new Map();
    this._calls = new Map();
  }

  // Creates a connection on the server side.

  _createClass(RpcConnection, [{
    key: 'getService',
    value: function getService(serviceName) {
      var service = this._objectRegistry.getService(serviceName);
      (0, (_assert || _load_assert()).default)(service != null, 'No config found for service ' + serviceName);
      return service;
    }
  }, {
    key: 'addServices',
    value: function addServices(services) {
      services.forEach(this.addService, this);
    }
  }, {
    key: 'addService',
    value: function addService(service) {
      this._serviceRegistry.addService(service);
    }

    // Delegate marshalling to the type registry.
  }, {
    key: 'marshal',
    value: function marshal(value, type) {
      return this._getTypeRegistry().marshal(this._objectRegistry, value, type);
    }
  }, {
    key: 'unmarshal',
    value: function unmarshal(value, type) {
      return this._getTypeRegistry().unmarshal(this._objectRegistry, value, type);
    }
  }, {
    key: 'marshalArguments',
    value: function marshalArguments(args, argTypes) {
      return this._getTypeRegistry().marshalArguments(this._objectRegistry, args, argTypes);
    }
  }, {
    key: 'unmarshalArguments',
    value: function unmarshalArguments(args, argTypes) {
      return this._getTypeRegistry().unmarshalArguments(this._objectRegistry, args, argTypes);
    }

    /**
     * Call a remote function, through the service framework.
     * @param functionName - The name of the remote function to invoke.
     * @param returnType - The type of object that this function returns, so the the transport
     *   layer can register the appropriate listeners.
     * @param args - The serialized arguments to invoke the remote function with.
     */
  }, {
    key: 'callRemoteFunction',
    value: function callRemoteFunction(functionName, returnType, args) {
      return this._sendMessageAndListenForResult((0, (_messages || _load_messages()).createCallMessage)(functionName, this._generateRequestId(), args), returnType, 'Calling function ' + functionName);
    }

    /**
     * Call a method of a remote object, through the service framework.
     * @param objectId - The id of the remote object.
     * @param methodName - The name of the method to invoke.
     * @param returnType - The type of object that this function returns, so the the transport
     *   layer can register the appropriate listeners.
     * @param args - The serialized arguments to invoke the remote method with.
     */
  }, {
    key: 'callRemoteMethod',
    value: function callRemoteMethod(objectId, methodName, returnType, args) {
      return this._sendMessageAndListenForResult((0, (_messages || _load_messages()).createCallObjectMessage)(methodName, objectId, this._generateRequestId(), args), returnType, 'Calling remote method ' + methodName + '.');
    }

    /**
     * Call a remote constructor, returning an id that eventually resolves to a unique identifier
     * for the object.
     * @param interfaceName - The name of the remote class for which to construct an object.
     * @param thisArg - The newly created proxy object.
     * @param unmarshalledArgs - Unmarshalled arguments to pass to the remote constructor.
     * @param argTypes - Types of arguments.
     */
  }, {
    key: 'createRemoteObject',
    value: function createRemoteObject(interfaceName, thisArg, unmarshalledArgs, argTypes) {
      var _this3 = this;

      var idPromise = _asyncToGenerator(function* () {
        var marshalledArgs = yield _this3._getTypeRegistry().marshalArguments(_this3._objectRegistry, unmarshalledArgs, argTypes);
        return _this3._sendMessageAndListenForResult((0, (_messages || _load_messages()).createNewObjectMessage)(interfaceName, _this3._generateRequestId(), marshalledArgs), 'promise', 'Creating instance of ' + interfaceName);
      })();
      this._objectRegistry.addProxy(thisArg, interfaceName, idPromise);
    }

    /**
     * Dispose a remote object. This makes it's proxies unsuable, and calls the `dispose` method on
     * the remote object.
     * @param object - The remote object.
     * @returns A Promise that resolves when the object disposal has completed.
     */
  }, {
    key: 'disposeRemoteObject',
    value: _asyncToGenerator(function* (object) {
      var objectId = yield this._objectRegistry.disposeProxy(object);
      if (objectId == null) {
        logger.info('Duplicate dispose call on remote proxy');
      } else if (this._transport.isClosed()) {
        logger.info('Dispose call on remote proxy after connection closed');
      } else {
        return yield this._sendMessageAndListenForResult((0, (_messages || _load_messages()).createDisposeMessage)(this._generateRequestId(), objectId), 'promise', 'Disposing object ' + objectId);
      }
    })

    /**
     * Helper function that listens for a result for the given id.
     * @param returnType - Determines the type of messages we should subscribe to, and what this
     *   function should return.
     * @param id - The id of the request who's result we are listening for.
     * @returns Depending on the expected return type, this function either returns undefined, a
     *   Promise, or an Observable.
     */
  }, {
    key: '_sendMessageAndListenForResult',
    value: function _sendMessageAndListenForResult(message, returnType, timeoutMessage) {
      var _this4 = this;

      var operation = function operation() {
        switch (returnType) {
          case 'void':
            _this4._transport.send(JSON.stringify(message));
            return; // No values to return.
          case 'promise':
            // Listen for a single message, and resolve or reject a promise on that message.
            return new Promise(function (resolve, reject) {
              _this4._transport.send(JSON.stringify(message));
              _this4._calls.set(message.id, new Call(message, timeoutMessage, resolve, reject, function () {
                _this4._calls.delete(message.id);
              }));
            });
          case 'observable':
            {
              var _ret = (function () {
                var id = message.id;
                (0, (_assert || _load_assert()).default)(!_this4._subscriptions.has(id));

                var sendSubscribe = function sendSubscribe() {
                  _this4._transport.send(JSON.stringify(message));
                };
                var sendUnsubscribe = function sendUnsubscribe() {
                  if (!_this4._transport.isClosed()) {
                    _this4._transport.send(JSON.stringify((0, (_messages || _load_messages()).createUnsubscribeMessage)(id)));
                  }
                };
                var hadSubscription = false;
                var observable = (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.create(function (observer) {
                  // Only allow a single subscription. This will be the common case,
                  // and adding this restriction allows disposing of the observable
                  // on the remote side after the initial subscription is complete.
                  if (hadSubscription) {
                    throw new Error('Attempt to re-connect with a remote Observable.');
                  }
                  hadSubscription = true;

                  var subscription = new Subscription(message, observer);
                  _this4._subscriptions.set(id, subscription);
                  sendSubscribe();

                  // Observable dispose function, which is called on subscription dispose, on stream
                  // completion, and on stream error.
                  return {
                    unsubscribe: function unsubscribe() {
                      if (!_this4._subscriptions.has(id)) {
                        // guard against multiple unsubscribe calls
                        return;
                      }
                      _this4._subscriptions.delete(id);

                      sendUnsubscribe();
                    }
                  };
                });

                // Conversion to ConnectableObservable happens in the generated
                // proxies.
                return {
                  v: observable
                };
              })();

              if (typeof _ret === 'object') return _ret.v;
            }
          default:
            throw new Error('Unkown return type: ' + returnType + '.');
        }
      };
      return (0, (_nuclideAnalytics || _load_nuclideAnalytics()).trackOperationTiming)(trackingIdOfMessageAndNetwork(this._objectRegistry, message), operation);
    }
  }, {
    key: '_returnPromise',
    value: function _returnPromise(id, timingTracker, candidate, type) {
      var _this5 = this;

      var returnVal = candidate;
      // Ensure that the return value is a promise.
      if (!isThenable(returnVal)) {
        returnVal = Promise.reject(new Error('Expected a Promise, but the function returned something else.'));
      }

      // Marshal the result, to send over the network.
      (0, (_assert || _load_assert()).default)(returnVal != null);
      returnVal = returnVal.then(function (value) {
        return _this5._getTypeRegistry().marshal(_this5._objectRegistry, value, type);
      });

      // Send the result of the promise across the socket.
      returnVal.then(function (result) {
        _this5._transport.send(JSON.stringify((0, (_messages || _load_messages()).createPromiseMessage)(id, result)));
        timingTracker.onSuccess();
      }, function (error) {
        _this5._transport.send(JSON.stringify((0, (_messages || _load_messages()).createErrorResponseMessage)(id, error)));
        timingTracker.onError(error == null ? new Error() : error);
      });
    }
  }, {
    key: '_returnObservable',
    value: function _returnObservable(id, returnVal, elementType) {
      var _this6 = this;

      var result = undefined;
      // Ensure that the return value is an observable.
      if (!isConnectableObservable(returnVal)) {
        result = (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.throw(new Error('Expected an Observable, but the function returned something else.')).publish();
      } else {
        result = returnVal;
      }

      // Marshal the result, to send over the network.
      result.concatMap(function (value) {
        return _this6._getTypeRegistry().marshal(_this6._objectRegistry, value, elementType);
      })

      // Send the next, error, and completion events of the observable across the socket.
      .subscribe(function (data) {
        _this6._transport.send(JSON.stringify((0, (_messages || _load_messages()).createNextMessage)(id, data)));
      }, function (error) {
        _this6._transport.send(JSON.stringify((0, (_messages || _load_messages()).createObserveErrorMessage)(id, error)));
        _this6._objectRegistry.removeSubscription(id);
      }, function (completed) {
        _this6._transport.send(JSON.stringify((0, (_messages || _load_messages()).createCompleteMessage)(id)));
        _this6._objectRegistry.removeSubscription(id);
      });

      this._objectRegistry.addSubscription(id, result.connect());
    }

    // Returns true if a promise was returned.
  }, {
    key: '_returnValue',
    value: function _returnValue(id, timingTracker, value, type) {
      switch (type.kind) {
        case 'void':
          break; // No need to send anything back to the user.
        case 'promise':
          this._returnPromise(id, timingTracker, value, type.type);
          return true;
        case 'observable':
          this._returnObservable(id, value, type.type);
          break;
        default:
          throw new Error('Unkown return type ' + type.kind + '.');
      }
      return false;
    }
  }, {
    key: '_callFunction',
    value: _asyncToGenerator(function* (id, timingTracker, call) {
      var _getFunctionImplemention2 = this._getFunctionImplemention(call.method);

      var localImplementation = _getFunctionImplemention2.localImplementation;
      var type = _getFunctionImplemention2.type;

      var marshalledArgs = yield this._getTypeRegistry().unmarshalArguments(this._objectRegistry, call.args, type.argumentTypes);

      return this._returnValue(id, timingTracker, localImplementation.apply(this, marshalledArgs), type.returnType);
    })
  }, {
    key: '_callMethod',
    value: _asyncToGenerator(function* (id, timingTracker, call) {
      var object = this._objectRegistry.unmarshal(call.objectId);
      (0, (_assert || _load_assert()).default)(object != null);

      var interfaceName = this._objectRegistry.getInterface(call.objectId);
      var classDefinition = this._getClassDefinition(interfaceName);
      (0, (_assert || _load_assert()).default)(classDefinition != null);
      var type = classDefinition.definition.instanceMethods.get(call.method);
      (0, (_assert || _load_assert()).default)(type != null);

      var marshalledArgs = yield this._getTypeRegistry().unmarshalArguments(this._objectRegistry, call.args, type.argumentTypes);

      return this._returnValue(id, timingTracker, object[call.method].apply(object, marshalledArgs), type.returnType);
    })
  }, {
    key: '_callConstructor',
    value: _asyncToGenerator(function* (id, timingTracker, constructorMessage) {
      var classDefinition = this._getClassDefinition(constructorMessage.interface);
      (0, (_assert || _load_assert()).default)(classDefinition != null);
      var localImplementation = classDefinition.localImplementation;
      var definition = classDefinition.definition;

      var constructorArgs = definition.constructorArgs;
      (0, (_assert || _load_assert()).default)(constructorArgs != null);

      var marshalledArgs = yield this._getTypeRegistry().unmarshalArguments(this._objectRegistry, constructorMessage.args, constructorArgs);

      // Create a new object and put it in the registry.
      var newObject = construct(localImplementation, marshalledArgs);

      // Return the object, which will automatically be converted to an id through the
      // marshalling system.
      this._returnPromise(id, timingTracker, Promise.resolve(newObject), {
        kind: 'named',
        name: constructorMessage.interface,
        location: (_builtinTypes || _load_builtinTypes()).builtinLocation
      });
    })
  }, {
    key: 'getTransport',
    value: function getTransport() {
      return this._transport;
    }
  }, {
    key: '_parseMessage',
    value: function _parseMessage(value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        logger.error('Recieved invalid JSON message: \'' + value + '\'');
        return null;
      }
    }
  }, {
    key: '_handleMessage',
    value: function _handleMessage(value) {
      var message = this._parseMessage(value);
      if (message == null) {
        return;
      }

      // TODO: advinsky uncomment after version 0.136 and below are phased out
      // invariant(message.protocol === SERVICE_FRAMEWORK3_PROTOCOL);

      switch (message.type) {
        case 'response':
        case 'error-response':
        case 'next':
        case 'complete':
        case 'error':
          this._handleResponseMessage(message);
          break;
        case 'call':
        case 'call-object':
        case 'new':
        case 'dispose':
        case 'unsubscribe':
          this._handleRequestMessage(message);
          break;
        default:
          throw new Error('Unexpected message type');
      }
    }
  }, {
    key: '_handleResponseMessage',
    value: function _handleResponseMessage(message) {
      var id = message.id;
      switch (message.type) {
        case 'response':
          {
            var call = this._calls.get(id);
            if (call != null) {
              var _result = message.result;

              call.resolve(_result);
            }
            break;
          }
        case 'error-response':
          {
            var call = this._calls.get(id);
            if (call != null) {
              var _error2 = message.error;

              call.reject(_error2);
            }
            break;
          }
        case 'next':
          {
            var subscription = this._subscriptions.get(id);
            if (subscription != null) {
              var value = message.value;

              subscription.next(value);
            }
            break;
          }
        case 'complete':
          {
            var subscription = this._subscriptions.get(id);
            if (subscription != null) {
              subscription.complete();
              this._subscriptions.delete(id);
            }
            break;
          }
        case 'error':
          {
            var subscription = this._subscriptions.get(id);
            if (subscription != null) {
              var _error3 = message.error;

              subscription.error(_error3);
              this._subscriptions.delete(id);
            }
            break;
          }
        default:
          throw new Error('Unexpected message type ' + JSON.stringify(message));
      }
    }
  }, {
    key: '_handleRequestMessage',
    value: _asyncToGenerator(function* (message) {
      var id = message.id;

      // Track timings of all function calls, method calls, and object creations.
      // Note: for Observables we only track how long it takes to create the initial Observable.
      // while for Promises we track the length of time it takes to resolve or reject.
      // For returning void, we track the time for the call to complete.
      var timingTracker = (0, (_nuclideAnalytics || _load_nuclideAnalytics()).startTracking)(trackingIdOfMessage(this._objectRegistry, message));

      // Here's the main message handler ...
      try {
        var returnedPromise = false;
        switch (message.type) {
          case 'call':
            returnedPromise = yield this._callFunction(id, timingTracker, message);
            break;
          case 'call-object':
            returnedPromise = yield this._callMethod(id, timingTracker, message);
            break;
          case 'new':
            yield this._callConstructor(id, timingTracker, message);
            returnedPromise = true;
            break;
          case 'dispose':
            yield this._objectRegistry.disposeObject(message.objectId);
            this._returnPromise(id, timingTracker, Promise.resolve(), (_builtinTypes || _load_builtinTypes()).voidType);
            returnedPromise = true;
            break;
          case 'unsubscribe':
            this._objectRegistry.disposeSubscription(id);
            break;
          default:
            throw new Error('Unkown message type ' + message.type);
        }
        if (!returnedPromise) {
          timingTracker.onSuccess();
        }
      } catch (e) {
        logger.error(e != null ? e.message : e);
        timingTracker.onError(e == null ? new Error() : e);
        this._transport.send(JSON.stringify((0, (_messages || _load_messages()).createErrorResponseMessage)(id, e)));
      }
    })
  }, {
    key: '_getFunctionImplemention',
    value: function _getFunctionImplemention(name) {
      return this._serviceRegistry.getFunctionImplemention(name);
    }
  }, {
    key: '_getClassDefinition',
    value: function _getClassDefinition(className) {
      return this._serviceRegistry.getClassDefinition(className);
    }
  }, {
    key: '_generateRequestId',
    value: function _generateRequestId() {
      return this._rpcRequestId++;
    }
  }, {
    key: '_getTypeRegistry',
    value: function _getTypeRegistry() {
      return this._serviceRegistry.getTypeRegistry();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._transport.close();
      this._objectRegistry.dispose();
      this._calls.forEach(function (call) {
        call.reject(new Error('Connection Closed'));
      });
      this._subscriptions.forEach(function (subscription) {
        subscription.error(new Error('Connection Closed'));
      });
      this._subscriptions.clear();
    }
  }], [{
    key: 'createServer',
    value: function createServer(serviceRegistry, transport) {
      return new RpcConnection('server', serviceRegistry, transport);
    }

    // Creates a client side connection to a server on another machine.
  }, {
    key: 'createRemote',
    value: function createRemote(transport, predefinedTypes, services) {
      return new RpcConnection('client', new (_ServiceRegistry || _load_ServiceRegistry()).ServiceRegistry(predefinedTypes, services), transport);
    }

    // Creates a client side connection to a server on the same machine.
  }, {
    key: 'createLocal',
    value: function createLocal(transport, predefinedTypes, services) {
      return new RpcConnection('client', new (_ServiceRegistry || _load_ServiceRegistry()).ServiceRegistry(predefinedTypes, services), transport);
    }
  }]);

  return RpcConnection;
})();

exports.RpcConnection = RpcConnection;

function trackingIdOfMessage(registry, message) {
  switch (message.type) {
    case 'call':
      return 'service-framework:' + message.method;
    case 'call-object':
      var callInterface = registry.getInterface(message.objectId);
      return 'service-framework:' + callInterface + '.' + message.method;
    case 'new':
      return 'service-framework:new:' + message.interface;
    case 'dispose':
      var interfaceName = registry.getInterface(message.objectId);
      return 'service-framework:dispose:' + interfaceName;
    case 'unsubscribe':
      return 'service-framework:disposeObservable';
    default:
      throw new Error('Unknown message type ' + message.type);
  }
}

function trackingIdOfMessageAndNetwork(registry, message) {
  return trackingIdOfMessage(registry, message) + ':plus-network';
}

/**
 * A helper function that let's us 'apply' an array of arguments to a constructor.
 * It works by creating a new constructor that has the same prototype as the original
 * constructor, and simply applies the original constructor directly to 'this'.
 * @returns An instance of classObject.
 */
function construct(classObject, args) {
  function F() {
    return classObject.apply(this, args);
  }
  F.prototype = classObject.prototype;
  return new F();
}

/**
 * A helper function that checks if an object is thenable (Promise-like).
 */
function isThenable(object) {
  return Boolean(object && object.then);
}

/**
 * A helper function that checks if an object is an Observable.
 */
function isConnectableObservable(object) {
  return Boolean(object && object.concatMap && object.subscribe && object.connect);
}