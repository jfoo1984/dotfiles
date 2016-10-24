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

exports.getDiagnosticRange = getDiagnosticRange;

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _commonsAtomRange;

function _load_commonsAtomRange() {
  return _commonsAtomRange = require('../../commons-atom/range');
}

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var logger = (0, (_nuclideLogging || _load_nuclideLogging()).getLogger)();

function tokenizedLineForRow(editor, line) /* atom$TokenizedLine */{
  var tokenBuffer = editor.hasOwnProperty('displayBuffer') ? editor.displayBuffer.tokenizedBuffer : editor.tokenizedBuffer;
  return tokenBuffer.tokenizedLineForRow(line);
}

// Finds the range of the module name from a pyflakes F4XX message.
// Assumes that the module name exists.
// Ported from https://github.com/AtomLinter/linter-flake8
function getModuleNameRange(message, line, editor) {
  // Split on space or dot to get the basename or alias, i.e. retrieve <a> in
  // "from .. import <a>" or "from .. import .. as <a>".
  var match = /'([^']+)'/.exec(message);
  if (match == null) {
    return null;
  }
  var symbol = match[1].split(/\s|\./).pop();

  var foundImport = false;
  var lineNumber = line;
  for (;;) {
    var offset = 0;
    var tokenizedLine = tokenizedLineForRow(editor, lineNumber);
    if (!tokenizedLine) {
      break;
    }
    for (var i = 0; i < tokenizedLine.tokens.length; i++) {
      var token = tokenizedLine.tokens[i];
      if (foundImport && token.value === symbol) {
        return new (_atom || _load_atom()).Range([lineNumber, offset], [lineNumber, offset + token.value.length]);
      }
      if (token.value === 'import' && token.scopes.indexOf('keyword.control.import.python') >= 0) {
        foundImport = true;
      }
      offset += token.value.length;
    }
    lineNumber += 1;
  }
  logger.warn('getModuleNameRange failed for message: ' + message);
}

// Computes an appropriate underline range using the diagnostic type information.
// Range variants include underlining the entire line, entire trimmed line,
// or a word or whitespace range within the line.

function getDiagnosticRange(diagnostic, editor) {
  var buffer = editor.getBuffer();

  // The diagnostic message's line index may be out of bounds if buffer contents
  // have changed. To prevent an exception, we just use the last line of the buffer if
  // unsafeLine is out of bounds.
  var code = diagnostic.code;
  var unsafeLine = diagnostic.line;
  var column = diagnostic.column;
  var message = diagnostic.message;

  var lastRow = buffer.getLastRow();
  var line = unsafeLine <= lastRow ? unsafeLine : lastRow;

  var lineLength = buffer.lineLengthForRow(line);
  var trimmedRange = (0, (_commonsAtomRange || _load_commonsAtomRange()).trimRange)(editor, buffer.rangeForRow(line, false));
  var trimmedStartCol = trimmedRange.start.column;
  var trimmedEndCol = trimmedRange.end.column;

  try {
    switch (code.slice(0, 2)) {
      // pep8 - indentation
      case 'E1':
      case 'E9':
      case 'W1':
        // For E901 SyntaxError and E902 IOError, we should underline the whole line.
        // FOr E901 IndentationError, proceed to only underline the leading whitespace.
        if (code === 'E902' || message.startsWith('SyntaxError')) {
          break;
        }
        return new (_atom || _load_atom()).Range([line, 0], [line, trimmedStartCol]);
      // pep8 - whitespace
      case 'E2':
        // '#' comment spacing
        if (code.startsWith('E26')) {
          return new (_atom || _load_atom()).Range([line, column - 1], [line, trimmedEndCol]);
        }
        var numericCode = parseInt(code.slice(1), 10);
        // Missing whitespace - underline the closest symbol
        if (numericCode >= 225 && numericCode <= 231 || numericCode === 275) {
          return new (_atom || _load_atom()).Range([line, column - 1], [line, column]);
        }
        // Extra whitespace - underline the offending whitespace
        var whitespace = (0, (_commonsAtomRange || _load_commonsAtomRange()).wordAtPosition)(editor, new (_atom || _load_atom()).Point(line, column), /\s+/g);
        if (whitespace) {
          return whitespace.range;
        }
        break;
      // pep8 - blank line
      // pep8 - line length
      case 'E3':
      case 'E5':
        return new (_atom || _load_atom()).Range([line, 0], [line, lineLength]);
      // pep8 - whitespace warning
      case 'W2':
        // trailing whitespace
        if (code === 'W291') {
          return new (_atom || _load_atom()).Range([line, trimmedEndCol], [line, lineLength]);
        }
        break;
      // pyflakes - import related messages
      case 'F4':
        if (code === 'F401') {
          // 'XXX' is imported but not used
          var range = getModuleNameRange(message, line, editor);
          if (range != null) {
            return range;
          }
        } else if (code === 'F405') {
          // <XXX> may be undefined, or defined from import *
          var _word = (0, (_commonsAtomRange || _load_commonsAtomRange()).wordAtPosition)(editor, new (_atom || _load_atom()).Point(line, column));
          if (_word) {
            return _word.range;
          }
        }
        break;
      // pyflakes - variable/name related messages
      case 'F8':
        // Highlight word for reference errors, default to highlighting line for
        // definition and other errors.
        if (!code.startsWith('F82')) {
          break;
        }
        var word = (0, (_commonsAtomRange || _load_commonsAtomRange()).wordAtPosition)(editor, new (_atom || _load_atom()).Point(line, column));
        if (word) {
          return word.range;
        }
        break;
      default:
        break;
    }
  } catch (e) {
    var diagnosticAsString = diagnostic.file + ':' + unsafeLine + ':' + column + ' - ' + code + ': ' + message;
    logger.error('Failed to find flake8 diagnostic range: ' + diagnosticAsString, e);
  }

  return new (_atom || _load_atom()).Range([line, trimmedStartCol], [line, trimmedEndCol]);
}