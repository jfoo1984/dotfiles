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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonsNodeNuclideUri;

function _load_commonsNodeNuclideUri() {
  return _commonsNodeNuclideUri = _interopRequireDefault(require('../../commons-node/nuclideUri'));
}

var _nuclideMarshalersCommon;

function _load_nuclideMarshalersCommon() {
  return _nuclideMarshalersCommon = require('../../nuclide-marshalers-common');
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var _commonsNodeProcess;

function _load_commonsNodeProcess() {
  return _commonsNodeProcess = require('../../commons-node/process');
}

var _nuclideRpc;

function _load_nuclideRpc() {
  return _nuclideRpc = require('../../nuclide-rpc');
}

var _nuclideRpc2;

function _load_nuclideRpc2() {
  return _nuclideRpc2 = require('../../nuclide-rpc');
}

var _nuclideFilewatcherRpc;

function _load_nuclideFilewatcherRpc() {
  return _nuclideFilewatcherRpc = require('../../nuclide-filewatcher-rpc');
}

var serviceRegistry = null;

function getServiceRegistry() {
  if (serviceRegistry == null) {
    serviceRegistry = new (_nuclideRpc2 || _load_nuclideRpc2()).ServiceRegistry((_nuclideMarshalersCommon || _load_nuclideMarshalersCommon()).getServerSideMarshalers, (0, (_nuclideRpc2 || _load_nuclideRpc2()).loadServicesConfig)((_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(__dirname, '..')));
  }
  return serviceRegistry;
}

function spawnClangProcess(src, serverArgs, flags) {
  var libClangLibraryFile = serverArgs.libClangLibraryFile;
  var pythonPathEnv = serverArgs.pythonPathEnv;
  var pythonExecutable = serverArgs.pythonExecutable;

  var pathToLibClangServer = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(__dirname, '../python/clang_server.py');
  var args = [pathToLibClangServer];
  if (libClangLibraryFile != null) {
    args.push('--libclang-file', libClangLibraryFile);
  }
  args.push('--', src);
  args.push.apply(args, flags);
  var options = {
    cwd: (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.dirname(pathToLibClangServer),
    stdio: 'pipe',
    detached: false, // When Atom is killed, clang_server.py should be killed, too.
    env: {
      PYTHONPATH: pythonPathEnv
    }
  };

  // Note that safeSpawn() often overrides options.env.PATH, but that only happens when
  // options.env is undefined (which is not the case here). This will only be an issue if the
  // system cannot find `pythonExecutable`.
  return (0, (_commonsNodeProcess || _load_commonsNodeProcess()).safeSpawn)(pythonExecutable, args, options);
}

var ClangServer = (function (_RpcProcess) {
  _inherits(ClangServer, _RpcProcess);

  _createClass(ClangServer, null, [{
    key: 'Status',
    value: Object.freeze({
      READY: 'ready',
      COMPILING: 'compiling'
    }),
    enumerable: true
  }]);

  function ClangServer(src, serverArgs, flagsData) {
    var _this = this;

    _classCallCheck(this, ClangServer);

    _get(Object.getPrototypeOf(ClangServer.prototype), 'constructor', this).call(this, 'ClangServer-' + src, getServiceRegistry(), function () {
      return spawnClangProcess(src, serverArgs, flagsData.flags);
    });
    this._usesDefaultFlags = flagsData.usesDefaultFlags;
    this._pendingCompileRequests = 0;
    this._serverStatus = new (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).BehaviorSubject(ClangServer.Status.READY);
    this._flagsChanged = false;
    if (flagsData.flagsFile != null) {
      this._flagsSubscription = (0, (_nuclideFilewatcherRpc || _load_nuclideFilewatcherRpc()).watchFile)(flagsData.flagsFile).refCount().take(1).subscribe(function (x) {
        _this._flagsChanged = true;
      }, function () {});
    }
  }

  _createClass(ClangServer, [{
    key: 'dispose',
    // ignore errors
    value: function dispose() {
      _get(Object.getPrototypeOf(ClangServer.prototype), 'dispose', this).call(this);
      this._serverStatus.complete();
      if (this._flagsSubscription != null) {
        this._flagsSubscription.unsubscribe();
      }
    }
  }, {
    key: 'getService',
    value: function getService() {
      return _get(Object.getPrototypeOf(ClangServer.prototype), 'getService', this).call(this, 'ClangProcessService');
    }

    /**
     * Returns RSS of the child process in bytes.
     * Works on Unix and Mac OS X.
     */
  }, {
    key: 'getMemoryUsage',
    value: _asyncToGenerator(function* () {
      if (this._process == null) {
        return 0;
      }

      var _ref = yield (0, (_commonsNodeProcess || _load_commonsNodeProcess()).asyncExecute)('ps', ['-p', this._process.pid.toString(), '-o', 'rss=']);

      var exitCode = _ref.exitCode;
      var stdout = _ref.stdout;

      if (exitCode !== 0) {
        return 0;
      }
      return parseInt(stdout, 10) * 1024; // ps returns KB
    })
  }, {
    key: 'getFlagsChanged',
    value: function getFlagsChanged() {
      return this._flagsChanged;
    }

    // Call this instead of using the RPC layer directly.
    // This way, we can track when the server is busy compiling.
  }, {
    key: 'compile',
    value: _asyncToGenerator(function* (contents) {
      var _this2 = this;

      if (this._pendingCompileRequests++ === 0) {
        this._serverStatus.next(ClangServer.Status.COMPILING);
      }
      try {
        var service = yield this.getService();
        return yield service.compile(contents).then(function (result) {
          return _extends({}, result, {
            accurateFlags: !_this2._usesDefaultFlags
          });
        });
      } finally {
        if (--this._pendingCompileRequests === 0) {
          this._serverStatus.next(ClangServer.Status.READY);
        }
      }
    })
  }, {
    key: 'getStatus',
    value: function getStatus() {
      return this._serverStatus.getValue();
    }
  }, {
    key: 'waitForReady',
    value: function waitForReady() {
      if (this.getStatus() === ClangServer.Status.READY) {
        return Promise.resolve();
      }
      return this._serverStatus.takeWhile(function (x) {
        return x !== ClangServer.Status.READY;
      }).toPromise();
    }
  }]);

  return ClangServer;
})((_nuclideRpc || _load_nuclideRpc()).RpcProcess);

exports.default = ClangServer;
module.exports = exports.default;