var AppAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
AppAssistant = (function() {
  function AppAssistant() {}
  AppAssistant.prototype.handleLaunch = function(params) {
    Mojo.Log.info("app " + Mojo.appInfo.id + " launched with:");
    Mojo.Log.info(JSON.stringify(params));
    if (params.searchString) {
      return AppAssistant.openFrontpage("clone", {
        search: params.searchString
      });
    } else {
      if (this.shouldDisplayAboutScene()) {
        return AppAssistant.cloneCard(null, {
          name: "about"
        }, {
          skip: true
        });
      } else {
        return AppAssistant.openFrontpage("clone", {});
      }
    }
  };
  AppAssistant.prototype.shouldDisplayAboutScene = function() {
    var cookie, value;
    if (Mojo.appInfo.id === 'com.tehtorq.redditlater-hb') {
      if (cookie = new Mojo.Model.Cookie("show-about-screen")) {
        value = cookie.get();
        if (value === void 0) {
          return true;
        }
      }
    }
    return false;
  };
  AppAssistant.cloneCard = function(controller, sceneArguments, sceneParameters) {
    var cardname, pushCard, samecard, stageController, _ref, _ref2;
    sceneParameters || (sceneParameters = {});
    samecard = StageAssistant.cookieValue("prefs-samecard", "off");
    if ((controller != null) && (samecard === "on") && (StageAssistant.stages.length > 0)) {
      controller.stageController.pushScene(sceneArguments, sceneParameters);
      return;
    }
    if ((sceneArguments != null) && ((_ref = sceneArguments.name) === 'prefs' || _ref === 'about')) {
      stageController = Mojo.Controller.getAppController().getStageController(sceneArguments.name);
      if (stageController != null) {
        stageController.activate();
        return;
      }
    }
    cardname = "card" + Math.floor(Math.random() * 10000);
    if ((sceneArguments != null) && ((_ref2 = sceneArguments.name) === 'prefs' || _ref2 === 'about')) {
      cardname = sceneArguments.name;
    }
    pushCard = __bind(function(stageController) {
      if (sceneArguments != null) {
        return stageController.pushScene(sceneArguments, sceneParameters);
      } else {
        return stageController.pushScene("frontpage", {});
      }
    }, this);
    StageAssistant.stages.push(cardname);
    return Mojo.Controller.getAppController().createStageWithCallback({
      name: cardname,
      lightweight: true
    }, pushCard, "card");
  };
  AppAssistant.open = function(url) {
    return new Mojo.Service.Request("palm://com.palm.applicationManager", {
      method: "open",
      parameters: {
        target: url,
        onSuccess: function() {},
        onFailure: function() {}
      }
    });
  };
  AppAssistant.open_donation_link = function() {
    return this.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BNANW6F5RNWD6");
  };
  AppAssistant.open_purchase_link = function() {
    return this.open("http://developer.palm.com/appredirect/?packageid=com.tehtorq.redditlater");
  };
  AppAssistant.deviceIsTouchPad = function() {
    if (Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch") > -1) {
      return true;
    }
    if (Mojo.Environment.DeviceInfo.screenWidth === 1024) {
      return true;
    }
    if (Mojo.Environment.DeviceInfo.screenHeight === 1024) {
      return true;
    }
    return false;
  };
  AppAssistant.openFrontpage = function(type, params, controller) {
    if (params == null) {
      params = {};
    }
    if (type === "clone") {
      return AppAssistant.cloneCard(controller, {
        name: "frontpage"
      }, params);
    } else if (type === "swap") {
      return controller.stageController.swapScene({
        name: "frontpage"
      }, params);
    }
  };
  return AppAssistant;
})();