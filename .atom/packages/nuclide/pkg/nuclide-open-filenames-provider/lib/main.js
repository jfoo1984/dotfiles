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

exports.registerProvider = registerProvider;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _OpenFileNameProvider;

function _load_OpenFileNameProvider() {
  return _OpenFileNameProvider = _interopRequireDefault(require('./OpenFileNameProvider'));
}

function registerProvider() {
  return (_OpenFileNameProvider || _load_OpenFileNameProvider()).default;
}