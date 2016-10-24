var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _nuclideUiAtomInput;

function _load_nuclideUiAtomInput() {
  return _nuclideUiAtomInput = require('../../nuclide-ui/AtomInput');
}

var _reactForAtom;

function _load_reactForAtom() {
  return _reactForAtom = require('react-for-atom');
}

var _assert;

function _load_assert() {
  return _assert = _interopRequireDefault(require('assert'));
}

var _atom;

function _load_atom() {
  return _atom = require('atom');
}

var _ConnectionDetailsForm;

function _load_ConnectionDetailsForm() {
  return _ConnectionDetailsForm = _interopRequireDefault(require('./ConnectionDetailsForm'));
}

var _formValidationUtils;

function _load_formValidationUtils() {
  return _formValidationUtils = require('./form-validation-utils');
}

var _nuclideUiButton;

function _load_nuclideUiButton() {
  return _nuclideUiButton = require('../../nuclide-ui/Button');
}

var _nuclideUiButtonGroup;

function _load_nuclideUiButtonGroup() {
  return _nuclideUiButtonGroup = require('../../nuclide-ui/ButtonGroup');
}

var PROFILE_NAME_LABEL = 'Profile Name';
var DEFAULT_SERVER_COMMAND_PLACEHOLDER = '(DEFAULT)';

var emptyFunction = function emptyFunction() {};

/**
 * A form that is used to create a new connection profile.
 */

var CreateConnectionProfileForm = (function (_React$Component) {
  _inherits(CreateConnectionProfileForm, _React$Component);

  function CreateConnectionProfileForm(props) {
    _classCallCheck(this, CreateConnectionProfileForm);

    _get(Object.getPrototypeOf(CreateConnectionProfileForm.prototype), 'constructor', this).call(this, props);
    this._clickSave = this._clickSave.bind(this);
    this._clickCancel = this._clickCancel.bind(this);
    this.disposables = new (_atom || _load_atom()).CompositeDisposable();
  }

  _createClass(CreateConnectionProfileForm, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var root = (_reactForAtom || _load_reactForAtom()).ReactDOM.findDOMNode(this);
      this.disposables.add(
      // Hitting enter when this panel has focus should confirm the dialog.
      atom.commands.add(root, 'core:confirm', this._clickSave),
      // Hitting escape when this panel has focus should cancel the dialog.
      atom.commands.add(root, 'core:cancel', this._clickCancel));
      this.refs['profile-name'].focus();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.disposables.dispose();
    }

    /**
     * Note: This form displays DEFAULT_SERVER_COMMAND_PLACEHOLDER as the prefilled
     * remote server command. The remote server command will only be saved if the
     * user changes it from this default.
     */
  }, {
    key: 'render',
    value: function render() {
      var initialFields = this.props.initialFormFields;

      return (_reactForAtom || _load_reactForAtom()).React.createElement(
        'div',
        null,
        (_reactForAtom || _load_reactForAtom()).React.createElement(
          'div',
          { className: 'form-group' },
          (_reactForAtom || _load_reactForAtom()).React.createElement(
            'label',
            null,
            PROFILE_NAME_LABEL,
            ':'
          ),
          (_reactForAtom || _load_reactForAtom()).React.createElement((_nuclideUiAtomInput || _load_nuclideUiAtomInput()).AtomInput, {
            initialValue: '',
            ref: 'profile-name',
            unstyled: true
          })
        ),
        (_reactForAtom || _load_reactForAtom()).React.createElement((_ConnectionDetailsForm || _load_ConnectionDetailsForm()).default, {
          initialUsername: initialFields.username,
          initialServer: initialFields.server,
          initialCwd: initialFields.cwd,
          initialRemoteServerCommand: DEFAULT_SERVER_COMMAND_PLACEHOLDER,
          initialSshPort: initialFields.sshPort,
          initialPathToPrivateKey: initialFields.pathToPrivateKey,
          initialAuthMethod: initialFields.authMethod,
          initialDisplayTitle: initialFields.displayTitle,
          onCancel: emptyFunction,
          onConfirm: this._clickSave,
          onDidChange: emptyFunction,
          ref: 'connection-details'
        }),
        (_reactForAtom || _load_reactForAtom()).React.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'flex-end' } },
          (_reactForAtom || _load_reactForAtom()).React.createElement(
            (_nuclideUiButtonGroup || _load_nuclideUiButtonGroup()).ButtonGroup,
            null,
            (_reactForAtom || _load_reactForAtom()).React.createElement(
              (_nuclideUiButton || _load_nuclideUiButton()).Button,
              { onClick: this._clickCancel },
              'Cancel'
            ),
            (_reactForAtom || _load_reactForAtom()).React.createElement(
              (_nuclideUiButton || _load_nuclideUiButton()).Button,
              { buttonType: (_nuclideUiButton || _load_nuclideUiButton()).ButtonTypes.PRIMARY, onClick: this._clickSave },
              'Save'
            )
          )
        )
      );
    }
  }, {
    key: '_getProfileName',
    value: function _getProfileName() {
      var fieldName = 'profile-name';
      return this.refs[fieldName] && this.refs[fieldName].getText().trim() || '';
    }
  }, {
    key: '_clickSave',
    value: function _clickSave() {
      // Validate the form inputs.
      var profileName = this._getProfileName();
      var connectionDetails = this.refs['connection-details'].getFormFields();
      var validationResult = (0, (_formValidationUtils || _load_formValidationUtils()).validateFormInputs)(profileName, connectionDetails, DEFAULT_SERVER_COMMAND_PLACEHOLDER);
      if (typeof validationResult.errorMessage === 'string') {
        atom.notifications.addError(validationResult.errorMessage);
        return;
      }
      (0, (_assert || _load_assert()).default)(validationResult.validatedProfile != null && typeof validationResult.validatedProfile === 'object');
      var newProfile = validationResult.validatedProfile;
      // Save the validated profile, and show any warning messages.
      if (typeof validationResult.warningMessage === 'string') {
        atom.notifications.addWarning(validationResult.warningMessage);
      }
      this.props.onSave(newProfile);
    }
  }, {
    key: '_clickCancel',
    value: function _clickCancel() {
      this.props.onCancel();
    }
  }]);

  return CreateConnectionProfileForm;
})((_reactForAtom || _load_reactForAtom()).React.Component);

module.exports = CreateConnectionProfileForm;

// A function called when the "Cancel" button is clicked.

// A function called when the "Save" button is clicked. The profile passed
// to the function is the profile that the user has just created.
// The CreateConnectionProfileForm will do basic validation on the inputs: It
// checks that the fields are non-empty before calling this function.

// The inputs to pre-fill the form with.