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

exports.sanitizeNuclideUri = sanitizeNuclideUri;
exports.getOpenFileEditorForRemoteProject = getOpenFileEditorForRemoteProject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _commonsNodeNuclideUri;

function _load_commonsNodeNuclideUri() {
  return _commonsNodeNuclideUri = _interopRequireDefault(require('../../commons-node/nuclideUri'));
}

var NUCLIDE_PROTOCOL_PREFIX = 'nuclide:/';
var NUCLIDE_PROTOCOL_PREFIX_WIN = 'nuclide:\\';
var NUCLIDE_PROTOCOL_PREFIX_LENGTH = NUCLIDE_PROTOCOL_PREFIX.length;

/**
 * Clean a nuclide URI from the prepended absolute path prefixes and fix
 * the broken uri, in the sense that it's nuclide:/server/path/to/dir instead of
 * nuclide://server/path/to/dir because Atom called path.normalize() on the directory uri.
 */

function sanitizeNuclideUri(uri_) {
  var uri = uri_;
  // Remove the leading absolute path prepended to the file paths
  // between atom reloads.
  var protocolIndex = uri.indexOf(NUCLIDE_PROTOCOL_PREFIX);
  if (protocolIndex > 0) {
    uri = uri.substring(protocolIndex);
  }
  // Add the missing slash, if removed through a path.normalize() call.
  if (uri.startsWith(NUCLIDE_PROTOCOL_PREFIX) && uri[NUCLIDE_PROTOCOL_PREFIX_LENGTH] !== '/' /* protocol missing last slash */) {

      uri = uri.substring(0, NUCLIDE_PROTOCOL_PREFIX_LENGTH) + '/' + uri.substring(NUCLIDE_PROTOCOL_PREFIX_LENGTH);
    }

  // On Windows path normalization converts all of the '/' chars to '\'
  // we need to revert that
  if (uri.startsWith(NUCLIDE_PROTOCOL_PREFIX_WIN)) {
    uri = NUCLIDE_PROTOCOL_PREFIX + '/' + uri.substring(NUCLIDE_PROTOCOL_PREFIX_LENGTH).replace(/\\/g, '/');
  }
  return uri;
}

function* getOpenFileEditorForRemoteProject(connectionConfig) {
  for (var _pane of atom.workspace.getPanes()) {
    var paneItems = _pane.getItems();
    for (var paneItem of paneItems) {
      if (!atom.workspace.isTextEditor(paneItem) || !paneItem.getURI()) {
        // Ignore non-text editors and new editors with empty uris / paths.
        continue;
      }
      var _uri = sanitizeNuclideUri(paneItem.getURI());

      var _default$parse = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.parse(_uri);

      var fileHostname = _default$parse.hostname;
      var _filePath = _default$parse.path;

      if (fileHostname === connectionConfig.host) {
        (0, (_assert || _load_assert()).default)(fileHostname);
        yield {
          pane: _pane,
          editor: paneItem,
          uri: _uri,
          filePath: _filePath
        };
      }
    }
  }
}