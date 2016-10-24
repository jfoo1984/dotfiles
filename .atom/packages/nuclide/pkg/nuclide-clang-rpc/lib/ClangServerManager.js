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

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var augmentDefaultFlags = _asyncToGenerator(function* (src, flags) {
  if (_getDefaultFlags === undefined) {
    _getDefaultFlags = null;
    try {
      // $FlowFB
      _getDefaultFlags = require('./fb/custom-flags').getDefaultFlags;
    } catch (e) {
      // Open-source version
    }
  }
  if (_getDefaultFlags != null) {
    return flags.concat((yield _getDefaultFlags(src)));
  }
  return flags;
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lruCache;

function _load_lruCache() {
  return _lruCache = _interopRequireDefault(require('lru-cache'));
}

var _os;

function _load_os() {
  return _os = _interopRequireDefault(require('os'));
}

var _commonsNodePromise;

function _load_commonsNodePromise() {
  return _commonsNodePromise = require('../../commons-node/promise');
}

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var _ClangFlagsManager;

function _load_ClangFlagsManager() {
  return _ClangFlagsManager = _interopRequireDefault(require('./ClangFlagsManager'));
}

var _ClangServer;

function _load_ClangServer() {
  return _ClangServer = _interopRequireDefault(require('./ClangServer'));
}

var _findClangServerArgs;

function _load_findClangServerArgs() {
  return _findClangServerArgs = _interopRequireDefault(require('./find-clang-server-args'));
}

// Limit the number of active Clang servers.
var SERVER_LIMIT = 20;

// Limit the total memory usage of all Clang servers.
var MEMORY_LIMIT = Math.round((_os || _load_os()).default.totalmem() * 15 / 100);

var _getDefaultFlags = undefined;

var ClangServerManager = (function () {
  function ClangServerManager() {
    _classCallCheck(this, ClangServerManager);

    this._flagsManager = new (_ClangFlagsManager || _load_ClangFlagsManager()).default();
    this._servers = new (_lruCache || _load_lruCache()).default({
      max: SERVER_LIMIT,
      dispose: function dispose(_, val) {
        val.dispose();
      }
    });
    // Avoid race conditions with simultaneous _checkMemoryUsage calls.
    this._checkMemoryUsage = (0, (_commonsNodePromise || _load_commonsNodePromise()).serializeAsyncCall)(this._checkMemoryUsageImpl.bind(this));
  }

  /**
   * Spawn one Clang server per translation unit (i.e. source file).
   * This allows working on multiple files at once, and simplifies per-file state handling.
   *
   * TODO(hansonw): We should ideally restart on change for all service requests.
   * However, restarting (and refetching flags) can take a very long time.
   * Currently, there's no "status" observable, so we can only provide a busy signal to the user
   * on diagnostic requests - and hence we only restart on 'compile' requests.
   */

  _createClass(ClangServerManager, [{
    key: 'getClangServer',
    value: _asyncToGenerator(function* (src, contents, defaultFlags, restartIfChanged) {
      var _this = this;

      var server = this._servers.get(src);
      if (server != null) {
        if (restartIfChanged && server.getFlagsChanged()) {
          this.reset(src);
        } else {
          return server;
        }
      }

      var _ref = yield Promise.all([(0, (_findClangServerArgs || _load_findClangServerArgs()).default)(), this._getFlags(src, defaultFlags)]);

      var _ref2 = _slicedToArray(_ref, 2);

      var serverArgs = _ref2[0];
      var flagsResult = _ref2[1];

      if (flagsResult == null) {
        return null;
      }
      // Another server could have been created while we were waiting.
      server = this._servers.get(src);
      if (server != null) {
        return server;
      }
      server = new (_ClangServer || _load_ClangServer()).default(src, serverArgs, flagsResult);
      // Seed with a compile request to ensure fast responses.
      server.compile(contents).then(function () {
        return _this._checkMemoryUsage();
      });
      this._servers.set(src, server);
      return server;
    })

    // 1. Attempt to get flags from ClangFlagsManager.
    // 2. Otherwise, fall back to default flags.
  }, {
    key: '_getFlags',
    value: _asyncToGenerator(function* (src, defaultFlags) {
      var flagsData = yield this._flagsManager.getFlagsForSrc(src).catch(function (e) {
        (0, (_nuclideLogging || _load_nuclideLogging()).getLogger)().error('Error getting flags for ' + src + ':', e);
        return null;
      });
      if (flagsData != null && flagsData.flags != null) {
        return {
          flags: flagsData.flags,
          usesDefaultFlags: false,
          flagsFile: flagsData.flagsFile
        };
      } else if (defaultFlags != null) {
        return {
          flags: yield augmentDefaultFlags(src, defaultFlags),
          usesDefaultFlags: true,
          flagsFile: flagsData != null ? flagsData.flagsFile : null
        };
      } else {
        return null;
      }
    })
  }, {
    key: 'reset',
    value: function reset(src) {
      if (src != null) {
        this._servers.del(src);
      } else {
        this._servers.reset();
      }
      this._flagsManager.reset();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._servers.reset();
      this._flagsManager.reset();
    }
  }, {
    key: '_checkMemoryUsageImpl',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      var usage = new Map();
      yield Promise.all(this._servers.values().map(_asyncToGenerator(function* (server) {
        var mem = yield server.getMemoryUsage();
        usage.set(server, mem);
      })));

      // Servers may have been deleted in the meantime, so calculate the total now.
      var total = 0;
      var count = 0;
      this._servers.forEach(function (server) {
        var mem = usage.get(server);
        if (mem) {
          total += mem;
          count++;
        }
      });

      // Remove servers until we're under the memory limit.
      // Make sure we allow at least one server to stay alive.
      if (count > 1 && total > MEMORY_LIMIT) {
        (function () {
          var toDispose = [];
          _this2._servers.rforEach(function (server, key) {
            var mem = usage.get(server);
            if (mem && count > 1 && total > MEMORY_LIMIT) {
              total -= mem;
              count--;
              toDispose.push(key);
            }
          });
          toDispose.forEach(function (key) {
            return _this2._servers.del(key);
          });
        })();
      }
    })
  }]);

  return ClangServerManager;
})();

exports.default = ClangServerManager;
module.exports = exports.default;