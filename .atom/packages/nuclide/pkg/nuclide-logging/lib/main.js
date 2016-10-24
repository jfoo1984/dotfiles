Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.flushLogsAndExit = flushLogsAndExit;
exports.flushLogsAndAbort = flushLogsAndAbort;
exports.updateConfig = updateConfig;
exports.initialUpdateConfig = initialUpdateConfig;
exports.getLogger = getLogger;
exports.getCategoryLogger = getCategoryLogger;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

/**
 * This designed for logging on both Nuclide client and Nuclide server. It is based on [log4js]
 * (https://www.npmjs.com/package/log4js) with the ability to lazy initialize and update config
 * after initialized.
 * To make sure we only have one instance of log4js logger initialized globally, we save the logger
 * to `global` object.
 */

var _stacktrace;

function _load_stacktrace() {
  return _stacktrace = _interopRequireDefault(require('./stacktrace'));
}

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _commonsNodeSingleton;

function _load_commonsNodeSingleton() {
  return _commonsNodeSingleton = _interopRequireDefault(require('../../commons-node/singleton'));
}

var _config;

function _load_config() {
  return _config = require('./config');
}

var _log4js;

function _load_log4js() {
  return _log4js = _interopRequireDefault(require('log4js'));
}

exports.getDefaultConfig = (_config || _load_config()).getDefaultConfig;
exports.getPathToLogFileForToday = (_config || _load_config()).getPathToLogFileForToday;
exports.CurrentDateFileAppender = (_config || _load_config()).CurrentDateFileAppender;
exports.getServerLogAppenderConfig = (_config || _load_config()).getServerLogAppenderConfig;

/* Listed in order of severity. */

var DEFAULT_LOGGER_CATEGORY = 'nuclide';
var INITIAL_UPDATE_CONFIG_KEY = '_initial_update_config_key_';

function getCategory(category) {
  return category ? category : DEFAULT_LOGGER_CATEGORY;
}

function flushLogsAndExit(exitCode) {
  (_log4js || _load_log4js()).default.shutdown(function () {
    return process.exit(exitCode);
  });
}

function flushLogsAndAbort() {
  (_log4js || _load_log4js()).default.shutdown(function () {
    return process.abort();
  });
}

/**
 * Get log4js logger instance which is also singleton per category.
 * log4js.getLogger() API internally should already provide singleton per category guarantee
 * see https://github.com/nomiddlename/log4js-node/blob/master/lib/log4js.js#L120 for details.
 */
function getLog4jsLogger(category) {
  return (_log4js || _load_log4js()).default.getLogger(category);
}

function updateConfig(config, options) {
  // update config takes affect global to all existing and future loggers.
  (_log4js || _load_log4js()).default.configure(config, options);
}

// Create a lazy logger that will not initialize the underlying log4js logger until
// `lazyLogger.$level(...)` is called. This way, another package could require nuclide-logging
// during activation without worrying about introducing a significant startup cost.
function createLazyLogger(category) {
  function createLazyLoggerMethod(level) {
    return function () {
      var logger = getLog4jsLogger(category);
      (0, (_assert || _load_assert()).default)(logger);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      logger[level].apply(logger, args);
    };
  }

  function setLoggerLevelHelper(level) {
    var logger = getLog4jsLogger(category);
    (0, (_assert || _load_assert()).default)(logger);
    logger.setLevel(level);
  }

  function isLevelEnabledHelper(level) {
    var logger = getLog4jsLogger(category);
    (0, (_assert || _load_assert()).default)(logger);
    return logger.isLevelEnabled(level);
  }

  return {
    debug: createLazyLoggerMethod('debug'),
    error: createLazyLoggerMethod('error'),
    fatal: createLazyLoggerMethod('fatal'),
    info: createLazyLoggerMethod('info'),
    trace: createLazyLoggerMethod('trace'),
    warn: createLazyLoggerMethod('warn'),
    isLevelEnabled: isLevelEnabledHelper,
    setLevel: setLoggerLevelHelper
  };
}

/**
 * Push initial default config to log4js.
 * Execute only once.
 */

function initialUpdateConfig() {
  return (_commonsNodeSingleton || _load_commonsNodeSingleton()).default.get(INITIAL_UPDATE_CONFIG_KEY, _asyncToGenerator(function* () {
    var defaultConfig = yield (0, (_config || _load_config()).getDefaultConfig)();
    updateConfig(defaultConfig);
  }));
}

// Get Logger instance which is singleton per logger category.

function getLogger(category) {
  (0, (_stacktrace || _load_stacktrace()).default)();
  initialUpdateConfig();

  var loggerCategory = getCategory(category);
  return (_commonsNodeSingleton || _load_commonsNodeSingleton()).default.get(loggerCategory, function () {
    return createLazyLogger(loggerCategory);
  });
}

// Utility function that returns a wrapper logger for input category.

function getCategoryLogger(category) {
  function setLogLevel(level) {
    getLogger(category).setLevel(level);
  }

  function logHelper(level, message) {
    var logger = getLogger(category);
    // isLevelEnabled() is required to reduce the amount of logging to
    // log4js which greatly improves performance.
    if (logger.isLevelEnabled(level)) {
      logger[level](message);
    }
  }

  function logTrace(message) {
    logHelper('trace', message);
  }

  function log(message) {
    logHelper('debug', message);
  }

  function logInfo(message) {
    logHelper('info', message);
  }

  function logError(message) {
    logHelper('error', message);
  }

  function logErrorAndThrow(message) {
    logError(message);
    logError(new Error().stack);
    throw new Error(message);
  }

  return {
    log: log,
    logTrace: logTrace,
    logInfo: logInfo,
    logError: logError,
    logErrorAndThrow: logErrorAndThrow,
    setLogLevel: setLogLevel
  };
}