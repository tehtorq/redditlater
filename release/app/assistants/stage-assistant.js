var StageAssistant;
StageAssistant = (function() {
  function StageAssistant() {}
  StageAssistant.cookieValue = function(cookieName, default_value) {
    var _ref;
    return ((_ref = new Mojo.Model.Cookie(cookieName)) != null ? _ref.get() : void 0) || default_value;
  };
  StageAssistant.cloneImageCard = function(assistant, article) {
    var lowercase_subreddit;
    lowercase_subreddit = article.data.subreddit.toLowerCase();
    if (article.kind != null) {
      article.url = Linky.parse(article.data.url);
    }
    if ((lowercase_subreddit === 'gif' || lowercase_subreddit === 'gifs' || lowercase_subreddit === 'nsfw_gif' || lowercase_subreddit === 'nsfw_gifs') || article.url.url.endsWith('.gif')) {
      return AppAssistant.cloneCard(assistant.controller, {
        name: "gif"
      }, {
        index: 0,
        images: [article.url.url],
        articles: [article]
      });
    } else {
      return AppAssistant.cloneCard(assistant.controller, {
        name: "image"
      }, {
        index: 0,
        images: [article.url.url],
        articles: [article]
      });
    }
  };
  StageAssistant.stages = [];
  StageAssistant.switchTheme = function(new_theme_path, old_theme_path) {
    var appController;
    appController = Mojo.Controller.getAppController();
    return _.each(this.stages, function(stage) {
      var controller;
      controller = appController.getStageController(stage);
      if (controller != null) {
        controller.unloadStylesheet(old_theme_path);
        return controller.loadStylesheet(new_theme_path);
      }
    });
  };
  StageAssistant.timeFormatter = function(time) {
    var lapsed, newDate, units;
    newDate = new Date();
    lapsed = newDate.getTime() / 1000 - time;
    units = Math.floor(lapsed / 60);
    if (units < 60) {
      if (units === 1) {
        return units.toString() + ' minute ago';
      } else {
        return units.toString() + ' minutes ago';
      }
    }
    units = Math.floor(units / 60);
    if (units < 24) {
      if (units === 1) {
        return units.toString() + ' hour ago';
      } else {
        return units.toString() + ' hours ago';
      }
    }
    units = Math.floor(units / 24);
    if (units === 1) {
      return units.toString() + ' day ago';
    } else {
      return units.toString() + ' days ago';
    }
  };
  StageAssistant.defaultWindowOrientation = function(assistant, orientation) {
    var value;
    value = StageAssistant.cookieValue("prefs-lock-orientation", "off");
    if (value === "on") {
      return assistant.controller.stageController.setWindowOrientation("up");
    } else {
      return assistant.controller.stageController.setWindowOrientation(orientation);
    }
  };
  return StageAssistant;
})();