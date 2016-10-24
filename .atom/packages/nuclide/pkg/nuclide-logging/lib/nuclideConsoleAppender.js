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

exports.getNuclideConsoleMessages = getNuclideConsoleMessages;

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var sub = null;
function getSubject() {
  if (sub == null) {
    sub = new (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Subject();
  }
  return sub;
}

function getNuclideConsoleMessages() {
  return getSubject().asObservable();
}

function consoleAppender() {
  return function (loggingEvent) {
    getSubject().next(loggingEvent);
  };
}

var appender = consoleAppender;
exports.appender = appender;
var configure = consoleAppender;
exports.configure = configure;