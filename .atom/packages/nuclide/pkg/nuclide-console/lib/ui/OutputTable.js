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

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _commonsNodeHasher;

function _load_commonsNodeHasher() {
  return _commonsNodeHasher = _interopRequireDefault(require('../../../commons-node/Hasher'));
}

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _RecordView;

function _load_RecordView() {
  return _RecordView = _interopRequireDefault(require('./RecordView'));
}

var OutputTable = (function (_React$Component) {
  _inherits(OutputTable, _React$Component);

  function OutputTable(props) {
    _classCallCheck(this, OutputTable);

    _get(Object.getPrototypeOf(OutputTable.prototype), 'constructor', this).call(this, props);
    this._hasher = new (_commonsNodeHasher || _load_commonsNodeHasher()).default();
    this._getExecutor = this._getExecutor.bind(this);
    this._getProvider = this._getProvider.bind(this);
  }

  _createClass(OutputTable, [{
    key: 'render',
    value: function render() {
      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        'div',
        {
          className: 'nuclide-console-table-wrapper native-key-bindings',
          tabIndex: '1' },
        this.props.records.map(this._renderRow, this)
      );
    }
  }, {
    key: '_getExecutor',
    value: function _getExecutor(id) {
      return this.props.getExecutor(id);
    }
  }, {
    key: '_getProvider',
    value: function _getProvider(id) {
      return this.props.getProvider(id);
    }
  }, {
    key: '_renderRow',
    value: function _renderRow(record, index) {
      return (_reactForAtom || _load_reactForAtom()).React.createElement((_RecordView || _load_RecordView()).default, {
        key: this._hasher.getHash(record),
        getExecutor: this._getExecutor,
        getProvider: this._getProvider,
        record: record,
        showSourceLabel: this.props.showSourceLabels
      });
    }
  }]);

  return OutputTable;
})((_reactForAtom || _load_reactForAtom()).React.Component);

exports.default = OutputTable;
module.exports = exports.default;