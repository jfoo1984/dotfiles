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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _commonsAtomCreatePackage;

function _load_commonsAtomCreatePackage() {
  return _commonsAtomCreatePackage = _interopRequireDefault(require('../../commons-atom/createPackage'));
}

var _commonsNodeEvent;

function _load_commonsNodeEvent() {
  return _commonsNodeEvent = require('../../commons-node/event');
}

var Activation = (function () {
  function Activation() {
    _classCallCheck(this, Activation);

    this._disposables = new (_atom || _load_atom()).CompositeDisposable();
  }

  _createClass(Activation, [{
    key: 'consumeOutputService',
    value: function consumeOutputService(api) {
      var messages = (0, (_commonsNodeEvent || _load_commonsNodeEvent()).observableFromSubscribeFunction)(atom.notifications.onDidAddNotification.bind(atom.notifications)).map(function (notification) {
        return {
          // TODO (matthewwithanm): Add timestamp once nuclide-console supports it.
          // TODO (matthewwithanm): Show notification description/details.
          text: notification.getMessage(),
          level: getLevel(notification.getType())
        };
      });

      this._disposables.add(api.registerOutputProvider({ id: 'Atom', messages: messages }));
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._disposables.dispose();
    }
  }]);

  return Activation;
})();

function getLevel(atomNotificationType) {
  switch (atomNotificationType) {
    case 'error':
    case 'fatal':
      return 'error';
    case 'info':
      return 'info';
    case 'warning':
      return 'warning';
    case 'success':
      return 'success';
    default:
      return 'log';
  }
}

exports.default = (0, (_commonsAtomCreatePackage || _load_commonsAtomCreatePackage()).default)(Activation);
module.exports = exports.default;