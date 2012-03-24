var PrefsAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
PrefsAssistant = (function() {
  __extends(PrefsAssistant, BaseAssistant);
  function PrefsAssistant(params) {
    this.handleUpdateApikey = __bind(this.handleUpdateApikey, this);
    this.handleUpdatePassword = __bind(this.handleUpdatePassword, this);
    this.handleUpdateUsername = __bind(this.handleUpdateUsername, this);    PrefsAssistant.__super__.constructor.apply(this, arguments);
  }
  PrefsAssistant.prototype.setup = function() {
    var apikey, password, username;
    PrefsAssistant.__super__.setup.apply(this, arguments);
    apikey = Preferences.apikey();
    username = Preferences.username();
    password = Preferences.password();
    this.controller.setupWidget("readitlaterUsernameTextFieldId", {
      focusMode: Mojo.Widget.focusSelectMode,
      textCase: Mojo.Widget.steModeLowerCase,
      maxLength: 30
    }, {
      value: username
    });
    this.controller.setupWidget("readitlaterPasswordTextFieldId", {
      focusMode: Mojo.Widget.focusSelectMode,
      textCase: Mojo.Widget.steModeLowerCase,
      maxLength: 30
    }, {
      value: password
    });
    this.controller.setupWidget("readitlaterAPIkeyTextFieldId", {
      focusMode: Mojo.Widget.focusSelectMode,
      textCase: Mojo.Widget.steModeLowerCase,
      maxLength: 30
    }, {
      value: apikey
    });
    if (this.showBackNavigation()) {
      this.viewMenuModel = {
        visible: true,
        items: [
          {
            label: $L('Back'),
            icon: '',
            command: 'back',
            width: 80
          }
        ]
      };
      return this.controller.setupWidget(Mojo.Menu.commandMenu, {
        menuClass: 'no-fade'
      }, this.viewMenuModel);
    }
  };
  PrefsAssistant.prototype.activate = function(event) {
    PrefsAssistant.__super__.activate.apply(this, arguments);
    return this.addListeners([this.controller.get("readitlaterUsernameTextFieldId"), Mojo.Event.propertyChange, this.handleUpdateUsername], [this.controller.get("readitlaterPasswordTextFieldId"), Mojo.Event.propertyChange, this.handleUpdatePassword], [this.controller.get("readitlaterAPIkeyTextFieldId"), Mojo.Event.propertyChange, this.handleUpdateApikey]);
  };
  PrefsAssistant.prototype.ready = function() {
    return this.controller.setInitialFocusedElement(null);
  };
  PrefsAssistant.prototype.handleUpdateUsername = function(event) {
    return Preferences.username(event.value);
  };
  PrefsAssistant.prototype.handleUpdatePassword = function(event) {
    return Preferences.password(event.value);
  };
  PrefsAssistant.prototype.handleUpdateApikey = function(event) {
    return Preferences.apikey(event.value);
  };
  PrefsAssistant.prototype.handleCommand = function(event) {
    if (event.type !== Mojo.Event.command) {
      return;
    }
    switch (event.command) {
      case 'back':
        return this.controller.stageController.popScene();
    }
  };
  return PrefsAssistant;
})();