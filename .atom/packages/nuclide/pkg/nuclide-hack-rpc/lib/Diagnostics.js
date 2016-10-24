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

exports.hackMessageToDiagnosticMessage = hackMessageToDiagnosticMessage;
exports.convertDiagnostics = convertDiagnostics;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _simpleTextBuffer;

function _load_simpleTextBuffer() {
  return _simpleTextBuffer = require('simple-text-buffer');
}

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _hackConfig;

function _load_hackConfig() {
  return _hackConfig = require('./hack-config');
}

/**
 * Currently, a diagnostic from Hack is an object with a "message" property.
 * Each item in the "message" array is an object with the following fields:
 *     - path (string) File that contains the error.
 *     - descr (string) Description of the error.
 *     - line (number) Start line.
 *     - endline (number) End line.
 *     - start (number) Start column.
 *     - end (number) End column.
 *     - code (number) Presumably an error code.
 * The message array may have more than one item. For example, if there is a
 * type incompatibility error, the first item in the message array blames the
 * usage of the wrong type and the second blames the declaration of the type
 * with which the usage disagrees. Note that these could occur in different
 * files.
 */
function extractRange(message) {
  // It's unclear why the 1-based to 0-based indexing works the way that it
  // does, but this has the desired effect in the UI, in practice.
  return new (_simpleTextBuffer || _load_simpleTextBuffer()).Range([message.line - 1, message.start - 1], [message.line - 1, message.end]);
}

// A trace object is very similar to an error object.
function hackMessageToTrace(traceError) {
  return {
    type: 'Trace',
    text: traceError.descr,
    filePath: traceError.path,
    range: extractRange(traceError)
  };
}

function hackMessageToDiagnosticMessage(hackMessages) {
  var causeMessage = hackMessages[0];
  (0, (_assert || _load_assert()).default)(causeMessage.path != null);
  var diagnosticMessage = {
    scope: 'file',
    providerName: 'Hack: ' + hackMessages[0].code,
    type: 'Error',
    text: causeMessage.descr,
    filePath: causeMessage.path,
    range: extractRange(causeMessage)
  };

  // When the message is an array with multiple elements, the second element
  // onwards comprise the trace for the error.
  if (hackMessages.length > 1) {
    diagnosticMessage.trace = hackMessages.slice(1).map(hackMessageToTrace);
  }

  return diagnosticMessage;
}

var DIAGNOSTICS_LIMIT = 10000;

function convertDiagnostics(result) {
  // Prevent too many diagnostics from killing the Atom process.
  var diagnostics = result.errors.slice(0, DIAGNOSTICS_LIMIT);
  if (diagnostics.length !== result.errors.length) {
    (_hackConfig || _load_hackConfig()).logger.logError('Too many Hack Errors. Found ' + result.errors.length + '. Truncating.');
  }

  // Convert array messages to Error Objects with Traces.
  var fileDiagnostics = diagnostics.map(function (diagnostic) {
    return hackMessageToDiagnosticMessage(diagnostic.message);
  });

  var filePathToMessages = new Map();
  for (var diagnostic of fileDiagnostics) {
    var path = diagnostic.filePath;
    var diagnosticArray = filePathToMessages.get(path);
    if (!diagnosticArray) {
      diagnosticArray = [];
      filePathToMessages.set(path, diagnosticArray);
    }
    diagnosticArray.push(diagnostic);
  }

  return { filePathToMessages: filePathToMessages };
}