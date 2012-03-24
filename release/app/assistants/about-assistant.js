var AboutAssistant;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
AboutAssistant = (function() {
  __extends(AboutAssistant, BaseAssistant);
  function AboutAssistant(params) {
    AboutAssistant.__super__.constructor.apply(this, arguments);
    this.params = params;
  }
  AboutAssistant.prototype.setup = function() {
    var _ref;
    AboutAssistant.__super__.setup.apply(this, arguments);
    if (((_ref = this.params) != null ? _ref.skip : void 0) === true) {
      this.viewMenuModel = {
        visible: true,
        items: [
          {}, {
            label: $L('Continue'),
            command: 'continue',
            icon: ""
          }, {}
        ]
      };
      return this.controller.setupWidget(Mojo.Menu.commandMenu, {
        menuClass: 'no-fade'
      }, this.viewMenuModel);
    } else {
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
        this.controller.setupWidget(Mojo.Menu.commandMenu, {
          menuClass: 'no-fade'
        }, this.viewMenuModel);
      }
      return this.controller.setupWidget(Mojo.Menu.appMenu, {}, {
        visible: true,
        items: [
          {
            label: "Feedback",
            command: 'feedback-cmd'
          }
        ]
      });
    }
  };
  AboutAssistant.prototype.ready = function() {
    var expiration;
    expiration = new Date(new Date().getTime() + 2 * 24 * 60 * 60000);
    return new Mojo.Model.Cookie("show-about-screen").put(expiration, expiration);
  };
  AboutAssistant.prototype.handleCommand = function(event) {
    if (event.type !== Mojo.Event.command) {
      return;
    }
    switch (event.command) {
      case 'top':
        return this.scrollToTop();
      case 'back':
        return this.controller.stageController.popScene();
      case 'continue':
        return AppAssistant.openFrontpage("swap", {}, this.controller);
      case 'feedback-cmd':
        return this.mail();
    }
  };
  AboutAssistant.prototype.mail = function() {
    return this.controller.serviceRequest("palm://com.palm.applicationManager", {
      method: 'open',
      parameters: {
        id: "com.palm.app.email",
        params: {
          summary: 'redditlater feedback',
          text: '',
          recipients: [
            {
              type: "email",
              role: 1,
              value: "i.am.douglas.anderson@gmail.com",
              contactDisplay: "redditlater"
            }
          ]
        }
      }
    });
  };
  return AboutAssistant;
})();