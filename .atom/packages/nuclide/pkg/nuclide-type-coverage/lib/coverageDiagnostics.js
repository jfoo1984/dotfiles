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

exports.diagnosticProviderForResultStream = diagnosticProviderForResultStream;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var _commonsNodeObservable;

function _load_commonsNodeObservable() {
  return _commonsNodeObservable = require('../../commons-node/observable');
}

function diagnosticProviderForResultStream(results, isEnabledStream) {
  var toggledResults = (0, (_commonsNodeObservable || _load_commonsNodeObservable()).toggle)(results, isEnabledStream);

  return {
    updates: (0, (_commonsNodeObservable || _load_commonsNodeObservable()).compact)(toggledResults.map(diagnosticsForResult)),
    invalidations: (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.merge(
    // Invalidate diagnostics when display is disabled
    isEnabledStream.filter(function (enabled) {
      return !enabled;
    }), toggledResults.filter(function (result) {
      switch (result.kind) {
        case 'not-text-editor':
        case 'no-provider':
        case 'provider-error':
        case 'pane-change':
          return true;
        case 'result':
          return result.result == null;
        default:
          return false;
      }
    })).mapTo({ scope: 'all' })
  };
}

/**
 * Preconditions:
 *   result.editor.getPath() != null
 *
 * This is reasonable because we only query providers when there is a path available for the current
 * text editor.
 */
function diagnosticsForResult(result) {
  if (result.kind !== 'result') {
    return null;
  }
  var value = result.result;
  if (value == null) {
    return null;
  }

  var editorPath = result.editor.getPath();
  (0, (_assert || _load_assert()).default)(editorPath != null);

  var providerName = result.provider.displayName;

  var diagnostics = value.uncoveredRegions.map(function (region) {
    return uncoveredRangeToDiagnostic(region, editorPath, providerName);
  });

  return {
    filePathToMessages: new Map([[editorPath, diagnostics]])
  };
}

function uncoveredRangeToDiagnostic(region, path, providerName) {
  var text = region.message != null ? region.message : 'Not covered by ' + providerName;
  return {
    scope: 'file',
    providerName: 'Type Coverage',
    type: 'Warning',
    filePath: path,
    range: region.range,
    text: text
  };
}