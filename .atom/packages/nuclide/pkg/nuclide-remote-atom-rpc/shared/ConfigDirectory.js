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

/**
 * The local command server stores its state in files in a directory. The structure of the config
 * directory is as follows:
 * - It contains a list of subdirectories where the name of each subdirectory corresponds to the
 *   port of the nuclide-server whose data it contains.
 * - Each subdirectory contains a serverInfo.json file, which contains a ServerInfo about the
 *   instance of nuclide-server.
 *
 * Code in this file is used by the NuclideServer process as well as the atom
 * command line process on the server.
 */

var createConfigDirectory = _asyncToGenerator(function* (clearDirectory) {
  var configDirPath = yield findPathToConfigDirectory(clearDirectory);
  if (configDirPath != null) {
    return configDirPath;
  } else {
    return null;
  }
});

var createNewEntry = _asyncToGenerator(function* (port, commandPort, family) {
  var clearDirectory = true;
  var configDirectory = yield createConfigDirectory(clearDirectory);
  if (configDirectory == null) {
    throw new Error('Could\'t create config directory');
  }

  var subdir = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(configDirectory, String(port));
  yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.rmdir(subdir);
  if (yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.exists(subdir)) {
    throw new Error('createNewEntry: Failed to delete: ' + subdir);
  }
  var info = {
    commandPort: commandPort,
    port: port,
    family: family
  };
  yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.mkdir(subdir);
  yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.writeFile((_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(subdir, SERVER_INFO_FILE), JSON.stringify(info));

  logger.debug('Created new remote atom config at ' + subdir + ' for port ' + commandPort + ' family ' + family);
});

exports.createNewEntry = createNewEntry;

var getServer = _asyncToGenerator(function* () {
  var clearDirectory = false;
  var configDirectory = yield createConfigDirectory(clearDirectory);
  if (configDirectory == null) {
    throw new Error('Could\'t create config directory');
  }

  var serverInfos = yield getServerInfos(configDirectory);
  // For now, just return the first ServerInfo found.
  // Currently there can be only one ServerInfo at a time.
  // In the future, we may use the serverMetadata to determine which server
  // to use.
  if (serverInfos.length > 0) {
    var _serverInfos$0 = serverInfos[0];
    var _commandPort = _serverInfos$0.commandPort;
    var _family = _serverInfos$0.family;

    logger.debug('Read remote atom config at ' + configDirectory + ' for port ' + _commandPort + ' family ' + _family);
    return serverInfos[0];
  } else {
    return null;
  }
});

exports.getServer = getServer;

var getServerInfos = _asyncToGenerator(function* (configDirectory) {
  var entries = yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.readdir(configDirectory);
  return (0, (_commonsNodeCollection || _load_commonsNodeCollection()).arrayCompact)((yield Promise.all(entries.map(_asyncToGenerator(function* (entry) {
    var subdir = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(configDirectory, entry);
    var info = JSON.parse((yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.readFile((_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(subdir, SERVER_INFO_FILE), 'utf8')));
    if (info.commandPort != null && info.family != null) {
      return info;
    } else {
      return null;
    }
  })))));
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonsNodeCollection;

function _load_commonsNodeCollection() {
  return _commonsNodeCollection = require('../../commons-node/collection');
}

var _commonsNodeFsPromise;

function _load_commonsNodeFsPromise() {
  return _commonsNodeFsPromise = _interopRequireDefault(require('../../commons-node/fsPromise'));
}

var _commonsNodeUserInfo;

function _load_commonsNodeUserInfo() {
  return _commonsNodeUserInfo = _interopRequireDefault(require('../../commons-node/userInfo'));
}

var _commonsNodeNuclideUri;

function _load_commonsNodeNuclideUri() {
  return _commonsNodeNuclideUri = _interopRequireDefault(require('../../commons-node/nuclideUri'));
}

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var _commonsNodePromise;

function _load_commonsNodePromise() {
  return _commonsNodePromise = require('../../commons-node/promise');
}

var _os;

function _load_os() {
  return _os = _interopRequireDefault(require('os'));
}

var logger = (0, (_nuclideLogging || _load_nuclideLogging()).getLogger)();

var NUCLIDE_DIR = '.nuclide';
var NUCLIDE_SERVER_INFO_DIR = 'command-server';
var SERVER_INFO_FILE = 'serverInfo.json';

function findPathToConfigDirectory(clearDirectory) {
  // Try some candidate directories. We exclude the directory if it is on NFS
  // because nuclide-server is local, so it should only write out its state to
  // a local directory.

  var _ref = (0, (_commonsNodeUserInfo || _load_commonsNodeUserInfo()).default)();

  var homedir = _ref.homedir;
  var username = _ref.username;

  var candidateDirectories = [
  // Start with the tmpdir
  (_os || _load_os()).default.tmpdir(),
  // The user's home directory is probably the most common place to store
  // this information, but it may also be on NFS.
  homedir,

  // If the user's home directory is on NFS, we try /data/users/$USER as a backup.
  '/data/users/' + username];

  return (0, (_commonsNodePromise || _load_commonsNodePromise()).asyncFind)(candidateDirectories, _asyncToGenerator(function* (directory) {
    if (directory != null && (yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.isNonNfsDirectory(directory))) {
      var configDirPath = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(directory, NUCLIDE_DIR, NUCLIDE_SERVER_INFO_DIR);
      if (clearDirectory) {
        // When starting up a new server, we remove any connection configs leftover
        // from previous runs.
        yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.rmdir(configDirPath);
        if (yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.exists(configDirPath)) {
          throw new Error('findPathToConfigDirectory: Failed to remove' + configDirPath);
        }
      }
      yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.mkdirp(configDirPath);
      return configDirPath;
    } else {
      return null;
    }
  }));
}

// Port on which the Atom process is connected to nuclide-server.

// Port for local command scripts to connect to the nuclide-server.

// address family