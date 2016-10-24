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

exports.getConnectionDialogDefaultSettings = getConnectionDialogDefaultSettings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonsNodeNuclideUri;

function _load_commonsNodeNuclideUri() {
  return _commonsNodeNuclideUri = _interopRequireDefault(require('../../commons-node/nuclideUri'));
}

var _commonsNodeUserInfo;

function _load_commonsNodeUserInfo() {
  return _commonsNodeUserInfo = _interopRequireDefault(require('../../commons-node/userInfo'));
}

var _nuclideRemoteConnection;

function _load_nuclideRemoteConnection() {
  return _nuclideRemoteConnection = require('../../nuclide-remote-connection');
}

function getConnectionDialogDefaultSettings() {
  var _ref = (0, (_commonsNodeUserInfo || _load_commonsNodeUserInfo()).default)();

  var username = _ref.username;
  var homedir = _ref.homedir;

  return {
    server: '',
    username: username,
    // Do not use path.join() because we assume that the remote machine is *nix,
    // so we always want to use `/` as the path separator for cwd, even if Atom
    // is running on Windows.
    cwd: '/home/' + username + '/',
    pathToPrivateKey: (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(homedir, '.ssh', 'id_rsa'),
    remoteServerCommand: 'nuclide-start-server',
    authMethod: (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).SshHandshake.SupportedMethods.PASSWORD,
    displayTitle: '(default)',
    sshPort: '22'
  };
}