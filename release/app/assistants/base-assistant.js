var BaseAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
BaseAssistant = (function() {
  function BaseAssistant() {
    this.cardname = "card" + Math.floor(Math.random() * 10000);
  }
  BaseAssistant.prototype.setup = function() {
    this.can_navigate_back = this.canNavigateBack();
    this.viewmenu_width = _.min([this.controller.window.innerWidth, this.controller.window.innerHeight]);
    return this.loadTheme();
  };
  BaseAssistant.prototype.activate = function() {
    return StageAssistant.defaultWindowOrientation(this, "free");
  };
  BaseAssistant.prototype.deactivate = function() {
    return this.removeListeners();
  };
  BaseAssistant.prototype.cleanup = function() {
    return Request.clear_all(this.cardname);
  };
  BaseAssistant.prototype.canNavigateBack = function() {
    return this.controller.stageController.getScenes().length > 0;
  };
  BaseAssistant.prototype.showBackNavigation = function() {
    return this.can_navigate_back && !Mojo.Environment.DeviceInfo.keyboardAvailable;
  };
  BaseAssistant.prototype.getViewMenuWidth = function() {
    return this.viewmenu_width;
  };
  BaseAssistant.prototype.scrollToTop = function() {
    return this.controller.getSceneScroller().mojo.scrollTo(0, 0, true);
  };
  BaseAssistant.prototype.spinSpinner = function(bool) {
    if (bool) {
      this.controller.get('spinner').mojo.start();
      return this.controller.get('loading').show();
    } else {
      this.controller.get('loading').hide();
      return this.controller.get('spinner').mojo.stop();
    }
  };
  BaseAssistant.prototype.addListeners = function() {
    this.listeners = arguments;
    return _.each(this.listeners, __bind(function(listener) {
      var _ref;
      return (_ref = Mojo.Event).listen.apply(_ref, listener);
    }, this));
  };
  BaseAssistant.prototype.removeListeners = function() {
    return _.each(this.listeners, __bind(function(listener) {
      var _ref;
      return (_ref = Mojo.Event).stopListening.apply(_ref, listener);
    }, this));
  };
  BaseAssistant.prototype.loadTheme = function() {};
  BaseAssistant.prototype.toggleSearch = function() {
    var ff;
    if (this.controller.getSceneScroller() != null) {
      this.scrollToTop();
    }
    ff = this.controller.get("filterfield");
    if (ff._mojoController.assistant.filterOpen) {
      return ff.mojo.close();
    } else {
      return ff.mojo.open();
    }
  };
  BaseAssistant.prototype.isLoggedIn = function() {
    return false;
  };
  BaseAssistant.prototype.log = function(stuff, stringify_it) {
    if (stuff == null) {
      stuff = {};
    }
    if (stringify_it == null) {
      stringify_it = true;
    }
    if (stringify_it) {
      return Mojo.Log.info(JSON.stringify(stuff));
    } else {
      return Mojo.Log.info(stuff);
    }
  };
  return BaseAssistant;
})();