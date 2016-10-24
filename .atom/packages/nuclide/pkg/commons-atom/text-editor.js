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

exports.existingEditorForUri = existingEditorForUri;
exports.existingEditorForBuffer = existingEditorForBuffer;

var loadBufferForUri = _asyncToGenerator(function* (uri) {
  var buffer = existingBufferForUri(uri);
  if (buffer == null) {
    buffer = createBufferForUri(uri);
  }
  if (buffer.loaded) {
    return buffer;
  }
  try {
    yield buffer.load();
    return buffer;
  } catch (error) {
    atom.project.removeBuffer(buffer);
    throw error;
  }
}

/**
 * Returns an existing buffer for that uri, or create one if not existing.
 */
);

exports.loadBufferForUri = loadBufferForUri;
exports.bufferForUri = bufferForUri;
exports.existingBufferForUri = existingBufferForUri;
exports.getViewOfEditor = getViewOfEditor;
exports.getScrollTop = getScrollTop;
exports.setScrollTop = setScrollTop;
exports.setPositionAndScroll = setPositionAndScroll;
exports.getCursorPositions = getCursorPositions;
exports.observeEditorDestroy = observeEditorDestroy;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _rxjsBundlesRxMinJs;

function _load_rxjsBundlesRxMinJs() {
  return _rxjsBundlesRxMinJs = require('rxjs/bundles/Rx.min.js');
}

var _commonsNodeNuclideUri;

function _load_commonsNodeNuclideUri() {
  return _commonsNodeNuclideUri = _interopRequireDefault(require('../commons-node/nuclideUri'));
}

var _nuclideRemoteConnection;

function _load_nuclideRemoteConnection() {
  return _nuclideRemoteConnection = require('../nuclide-remote-connection');
}

var _commonsNodeEvent;

function _load_commonsNodeEvent() {
  return _commonsNodeEvent = require('../commons-node/event');
}

/**
 * Returns a text editor that has the given path open, or null if none exists. If there are multiple
 * text editors for this path, one is chosen arbitrarily.
 */

function existingEditorForUri(path) {
  // This isn't ideal but realistically iterating through even a few hundred editors shouldn't be a
  // real problem. And if you have more than a few hundred you probably have bigger problems.
  for (var editor of atom.workspace.getTextEditors()) {
    if (editor.getPath() === path) {
      return editor;
    }
  }

  return null;
}

/**
 * Returns a text editor that has the given buffer open, or null if none exists. If there are
 * multiple text editors for this buffer, one is chosen arbitrarily.
 */

function existingEditorForBuffer(buffer) {
  // This isn't ideal but realistically iterating through even a few hundred editors shouldn't be a
  // real problem. And if you have more than a few hundred you probably have bigger problems.
  for (var editor of atom.workspace.getTextEditors()) {
    if (editor.getBuffer() === buffer) {
      return editor;
    }
  }

  return null;
}

function bufferForUri(uri) {
  var buffer = existingBufferForUri(uri);
  if (buffer != null) {
    return buffer;
  }
  return createBufferForUri(uri);
}

function createBufferForUri(uri) {
  var buffer = undefined;
  if ((_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.isLocal(uri)) {
    buffer = new (_atom || _load_atom()).TextBuffer({ filePath: uri });
  } else {
    var connection = (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).ServerConnection.getForUri(uri);
    if (connection == null) {
      throw new Error('ServerConnection cannot be found for uri: ' + uri);
    }
    buffer = new (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).NuclideTextBuffer(connection, { filePath: uri });
  }
  atom.project.addBuffer(buffer);
  (0, (_assert || _load_assert()).default)(buffer);
  return buffer;
}

/**
 * Returns an exsting buffer for that uri, or null if not existing.
 */

function existingBufferForUri(uri) {
  return atom.project.findBufferForPath(uri);
}

function getViewOfEditor(editor) {
  return atom.views.getView(editor);
}

function getScrollTop(editor) {
  return getViewOfEditor(editor).getScrollTop();
}

function setScrollTop(editor, scrollTop) {
  getViewOfEditor(editor).setScrollTop(scrollTop);
}

/**
 * Does a best effort to set an editor pane to a given cursor position & scroll.
 * Does not ensure that the current cursor position is visible.
 *
 * Can be used with editor.getCursorBufferPosition() & getScrollTop() to restore
 * an editors cursor and scroll.
 */

function setPositionAndScroll(editor, position, scrollTop) {
  editor.setCursorBufferPosition(position, { autoscroll: false });
  setScrollTop(editor, scrollTop);
}

function getCursorPositions(editor) {
  // This will behave strangely in the face of multiple cursors. Consider supporting multiple
  // cursors in the future.
  var cursor = editor.getCursors()[0];
  (0, (_assert || _load_assert()).default)(cursor != null);
  return (_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.merge((_rxjsBundlesRxMinJs || _load_rxjsBundlesRxMinJs()).Observable.of(cursor.getBufferPosition()), (0, (_commonsNodeEvent || _load_commonsNodeEvent()).observableFromSubscribeFunction)(cursor.onDidChangePosition.bind(cursor)).map(function (event) {
    return event.newBufferPosition;
  }));
}

function observeEditorDestroy(editor) {
  return (0, (_commonsNodeEvent || _load_commonsNodeEvent()).observableFromSubscribeFunction)(editor.onDidDestroy.bind(editor)).map(function (event) {
    return editor;
  }).take(1);
}