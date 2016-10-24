var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

/**
 * Renames a single node to the new path.
 */

var renameNode = _asyncToGenerator(function* (node, destPath) {
  if (!isValidRename(node, destPath)) {
    return;
  }
  var filePath = (_FileTreeHelpers || _load_FileTreeHelpers()).default.keyToPath(node.uri);

  // Need to update the paths in editors before the rename to prevent them from closing
  // In case of an error - undo the editor paths rename
  (_FileTreeHelpers || _load_FileTreeHelpers()).default.updatePathInOpenedEditors(filePath, destPath);
  try {
    var service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getFileSystemServiceByNuclideUri)(filePath);
    // Throws if the destPath already exists.
    yield service.rename((_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.getPath(filePath), (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.getPath(destPath));

    var hgRepository = getHgRepositoryForNode(node);
    if (hgRepository == null) {
      return;
    }
    yield hgRepository.rename([filePath], destPath, true /* after */);
  } catch (err) {
    (_FileTreeHelpers || _load_FileTreeHelpers()).default.updatePathInOpenedEditors(destPath, filePath);
    throw err;
  }
}

/**
 * Lock on move to prevent concurrent moves, which may lead to race conditions
 * with the hg wlock.
 */
);

/**
 * Moves an array of nodes into the destPath, ignoring nodes that cannot be moved.
 * This wrapper prevents concurrent move operations.
 */

var moveNodes = _asyncToGenerator(function* (nodes, destPath) {
  if (isMoving) {
    return;
  }
  isMoving = true;

  // Reset isMoving to false whenever move operation completes, errors, or times out.
  yield (0, (_commonsNodePromise || _load_commonsNodePromise()).triggerAfterWait)(_moveNodesUnprotected(nodes, destPath), MOVE_TIMEOUT, resetIsMoving, /* timeoutFn */
  resetIsMoving);
});

/* cleanupFn */

var _moveNodesUnprotected = _asyncToGenerator(function* (nodes, destPath) {
  var paths = [];

  try {
    var filteredNodes = nodes.filter(function (node) {
      return isValidRename(node, destPath);
    });
    // Collapse paths that are in the same subtree, keeping only the subtree root.
    paths = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.collapse(filteredNodes.map(function (node) {
      return (_FileTreeHelpers || _load_FileTreeHelpers()).default.keyToPath(node.uri);
    }));

    if (paths.length === 0) {
      return;
    }

    // Need to update the paths in editors before the rename to prevent them from closing
    // In case of an error - undo the editor paths rename
    paths.forEach(function (path) {
      var newPath = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(destPath, (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.basename(path));
      (_FileTreeHelpers || _load_FileTreeHelpers()).default.updatePathInOpenedEditors(path, newPath);
    });

    var service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getFileSystemServiceByNuclideUri)(paths[0]);
    yield service.move(paths.map(function (p) {
      return (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.getPath(p);
    }), (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.getPath(destPath));

    // All filtered nodes should have the same rootUri, so we simply attempt to
    // retrieve the hg repository using the first node.
    var hgRepository = getHgRepositoryForNode(filteredNodes[0]);
    if (hgRepository == null) {
      return;
    }
    yield hgRepository.rename(paths, destPath, true /* after */);
  } catch (e) {
    // Restore old editor paths upon error.
    paths.forEach(function (path) {
      var newPath = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.join(destPath, (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.basename(path));
      (_FileTreeHelpers || _load_FileTreeHelpers()).default.updatePathInOpenedEditors(newPath, path);
    });
    throw e;
  }
}

/**
 * Deletes an array of nodes.
 */
);

var deleteNodes = _asyncToGenerator(function* (nodes) {
  // Filter out children nodes to avoid ENOENTs that happen when parents are
  // deleted before its children. Convert to List so we can use groupBy.
  var paths = (_immutable || _load_immutable()).default.List((_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.collapse(nodes.map(function (node) {
    return (_FileTreeHelpers || _load_FileTreeHelpers()).default.keyToPath(node.uri);
  })));
  var localPaths = paths.filter(function (path) {
    return (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.isLocal(path);
  });
  var remotePaths = paths.filter(function (path) {
    return (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.isRemote(path);
  });

  // 1) Move local nodes to trash.
  localPaths.forEach(function (path) {
    return (_electron || _load_electron()).shell.moveItemToTrash(path);
  });

  // 2) Batch delete remote nodes, one request per hostname.
  if (remotePaths.size > 0) {
    var pathsByHost = remotePaths.groupBy(function (path) {
      return (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.getHostname(path);
    });

    yield Promise.all(pathsByHost.map(_asyncToGenerator(function* (pathGroup) {
      // Batch delete using fs service.
      var service = (0, (_nuclideRemoteConnection || _load_nuclideRemoteConnection()).getFileSystemServiceByNuclideUri)(pathGroup.get(0));
      yield service.rmdirAll(pathGroup.map(function (path) {
        return (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.getPath(path);
      }).toJS());
    })));
  }

  // 3) Batch hg remove nodes that belong to an hg repo, one request per repo.
  var nodesByHgRepository = (_immutable || _load_immutable()).default.List(nodes).filter(function (node) {
    return getHgRepositoryForNode(node) != null;
  }).groupBy(function (node) {
    return getHgRepositoryForNode(node);
  }).entrySeq();

  yield Promise.all(nodesByHgRepository.map(_asyncToGenerator(function* (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var hgRepository = _ref2[0];
    var repoNodes = _ref2[1];

    var hgPaths = (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.collapse(repoNodes.map(function (node) {
      return (_FileTreeHelpers || _load_FileTreeHelpers()).default.keyToPath(node.uri);
    }).toJS());
    yield hgRepository.remove(hgPaths, true /* after */);
  })));
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _electron;

function _load_electron() {
  return _electron = require('electron');
}

var _immutable;

function _load_immutable() {
  return _immutable = _interopRequireDefault(require('immutable'));
}

var _commonsNodeNuclideUri;

function _load_commonsNodeNuclideUri() {
  return _commonsNodeNuclideUri = _interopRequireDefault(require('../../commons-node/nuclideUri'));
}

var _FileTreeHelpers;

function _load_FileTreeHelpers() {
  return _FileTreeHelpers = _interopRequireDefault(require('./FileTreeHelpers'));
}

var _commonsNodePromise;

function _load_commonsNodePromise() {
  return _commonsNodePromise = require('../../commons-node/promise');
}

var _nuclideRemoteConnection;

function _load_nuclideRemoteConnection() {
  return _nuclideRemoteConnection = require('../../nuclide-remote-connection');
}

var MOVE_TIMEOUT = 10000;

function getHgRepositoryForNode(node) {
  var repository = node.repo;
  if (repository != null && repository.getType() === 'hg') {
    return repository;
  }
  return null;
}

/**
 * Determines whether renaming the given node to the specified destPath is an
 * acceptable rename.
 */
function isValidRename(node, destPath_) {
  var destPath = destPath_;
  var path = (_FileTreeHelpers || _load_FileTreeHelpers()).default.keyToPath(node.uri);
  var rootPath = (_FileTreeHelpers || _load_FileTreeHelpers()).default.keyToPath(node.rootUri);

  destPath = (_FileTreeHelpers || _load_FileTreeHelpers()).default.keyToPath(destPath);

  return (_FileTreeHelpers || _load_FileTreeHelpers()).default.getEntryByKey(node.uri) != null &&
  // This will only detect exact equalities, mostly preventing moves of a
  // directory into itself from causing an error. If a case-changing rename
  // should be a noop for the current OS's file system, this is handled by the
  // fs module.
  path !== destPath &&
  // Disallow renames where the destination is a child of the source node.
  !(_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.contains(path, (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.dirname(destPath)) &&
  // Disallow renames across projects for the time being, since cross-host and
  // cross-repository moves are a bit tricky.
  (_commonsNodeNuclideUri || _load_commonsNodeNuclideUri()).default.contains(rootPath, destPath);
}var isMoving = false;

function resetIsMoving() {
  isMoving = false;
}

module.exports = {
  getHgRepositoryForNode: getHgRepositoryForNode,
  isValidRename: isValidRename,
  renameNode: renameNode,
  moveNodes: moveNodes,
  deleteNodes: deleteNodes
};