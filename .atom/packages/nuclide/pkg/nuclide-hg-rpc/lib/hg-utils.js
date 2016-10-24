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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Calls out to checkOutput using the 'hg' command.
 * @param options as specified by http://nodejs.org/api/child_process.html. Additional options:
 *   - NO_HGPLAIN set if the $HGPLAIN environment variable should not be used.
 *   - TTY_OUTPUT set if the command should be run as if it were attached to a tty.
 */

var hgAsyncExecute = _asyncToGenerator(function* (args_, options_) {
  var _getHgExecParams = getHgExecParams(args_, options_);

  var command = _getHgExecParams.command;
  var args = _getHgExecParams.args;
  var options = _getHgExecParams.options;

  var result = yield (0, (_commonsNodeProcess || _load_commonsNodeProcess()).asyncExecute)(command, args, options);
  if (result.exitCode === 0) {
    return result;
  } else {
    logAndThrowHgError(args, options, result.stdout, result.stderr);
  }
}

/**
 * Calls hg commands, returning an Observable to allow aborting and streaming progress output.
 */
);

exports.hgAsyncExecute = hgAsyncExecute;
exports.hgObserveExecution = hgObserveExecution;
exports.hgRunCommand = hgRunCommand;

var createCommmitMessageTempFile = _asyncToGenerator(function* (commitMessage) {
  var tempFile = yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.tempfile();
  var strippedMessage = commitMessage.replace(COMMIT_MESSAGE_STRIP_LINE, '');
  yield (_commonsNodeFsPromise || _load_commonsNodeFsPromise()).default.writeFile(tempFile, strippedMessage);
  return tempFile;
});

exports.createCommmitMessageTempFile = createCommmitMessageTempFile;

var getEditMergeConfigs = _asyncToGenerator(function* () {
  var connectionDetails = yield (0, (_nuclideRemoteAtomRpc || _load_nuclideRemoteAtomRpc()).getConnectionDetails)();
  if (connectionDetails == null) {
    throw new Error('CommandServer not initialized!');
  }
  // Atom RPC needs to agree with the Atom process / nuclide server on the address and port.
  var hgEditor = 'ATOM_BACKUP_EDITOR=false "' + getAtomRpcScriptPath() + '"' + (' -f ' + connectionDetails.family + ' -p ' + connectionDetails.port + ' --wait');
  return {
    args: ['--config', 'merge-tools.editmerge.check=conflicts', '--config', 'ui.merge=editmerge'],
    hgEditor: hgEditor
  };
});

exports.getEditMergeConfigs = getEditMergeConfigs;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonsNodeProcess;

function _load_commonsNodeProcess() {
  return _commonsNodeProcess = require('../../commons-node/process');
}

var _nuclideLogging;

function _load_nuclideLogging() {
  return _nuclideLogging = require('../../nuclide-logging');
}

var _commonsNodeFsPromise;

function _load_commonsNodeFsPromise() {
  return _commonsNodeFsPromise = _interopRequireDefault(require('../../commons-node/fsPromise'));
}

var _commonsNodeProcess2;

function _load_commonsNodeProcess2() {
  return _commonsNodeProcess2 = require('../../commons-node/process');
}

var _nuclideRemoteAtomRpc;

function _load_nuclideRemoteAtomRpc() {
  return _nuclideRemoteAtomRpc = require('../../nuclide-remote-atom-rpc');
}

// Mercurial (as of v3.7.2) [strips lines][1] matching the following prefix when a commit message is
// created by an editor invoked by Mercurial. Because Nuclide is not invoked by Mercurial, Nuclide
// must mimic the same stripping.
//
// Note: `(?m)` converts to `/m` in JavaScript-flavored RegExp to mean 'multiline'.
//
// [1] https://selenic.com/hg/file/3.7.2/mercurial/cmdutil.py#l2734
var COMMIT_MESSAGE_STRIP_LINE = /^HG:.*(\n|$)/gm;
function hgObserveExecution(args_, options_) {
  var _getHgExecParams2 = getHgExecParams(args_, options_);

  var command = _getHgExecParams2.command;
  var args = _getHgExecParams2.args;
  var options = _getHgExecParams2.options;

  return (0, (_commonsNodeProcess2 || _load_commonsNodeProcess2()).observeProcess)(function () {
    return (0, (_commonsNodeProcess2 || _load_commonsNodeProcess2()).safeSpawn)(command, args, options);
  }, true);
}

/**
 * Calls hg commands, returning an Observable to allow aborting.
 * Resolves to stdout.
 */
// kill process tree on complete.

function hgRunCommand(args_, options_) {
  var _getHgExecParams3 = getHgExecParams(args_, options_);

  var command = _getHgExecParams3.command;
  var args = _getHgExecParams3.args;
  var options = _getHgExecParams3.options;

  return (0, (_commonsNodeProcess2 || _load_commonsNodeProcess2()).runCommand)(command, args, options, true /* kill process tree on complete */);
}

function logAndThrowHgError(args, options, stdout, stderr) {
  (0, (_nuclideLogging || _load_nuclideLogging()).getLogger)().error('Error executing hg command: ' + JSON.stringify(args) + '\n' + ('stderr: ' + stderr + '\nstdout: ' + stdout + '\n') + ('options: ' + JSON.stringify(options)));
  if (stderr.length > 0 && stdout.length > 0) {
    throw new Error('hg error\nstderr: ' + stderr + '\nstdout: ' + stdout);
  } else {
    // One of `stderr` or `stdout` is empty - not both.
    throw new Error(stderr || stdout);
  }
}

function getHgExecParams(args_, options_) {
  var args = args_;
  var options = _extends({}, options_, {
    env: _extends({}, (0, (_commonsNodeProcess2 || _load_commonsNodeProcess2()).getOriginalEnvironment)())
  });
  if (!options.NO_HGPLAIN) {
    // Setting HGPLAIN=1 overrides any custom aliases a user has defined.
    options.env.HGPLAIN = 1;
  }
  if (options.HGEDITOR != null) {
    options.env.HGEDITOR = options.HGEDITOR;
  }

  var command = undefined;
  if (options.TTY_OUTPUT) {
    command = 'script';
    args = (0, (_commonsNodeProcess || _load_commonsNodeProcess()).createArgsForScriptCommand)('hg', args);
  } else {
    command = 'hg';
  }
  return { command: command, args: args, options: options };
}

var atomRpcEditorPath = undefined;

function getAtomRpcScriptPath() {
  if (atomRpcEditorPath == null) {
    try {
      atomRpcEditorPath = require.resolve('../../nuclide-remote-atom-rpc/bin/fb-atom');
    } catch (error) {
      atomRpcEditorPath = require.resolve('../../nuclide-remote-atom-rpc/bin/atom');
    }
  }
  return atomRpcEditorPath;
}