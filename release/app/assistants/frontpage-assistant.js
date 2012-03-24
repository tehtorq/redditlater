var FrontpageAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
FrontpageAssistant = (function() {
  __extends(FrontpageAssistant, PowerScrollBase);
  function FrontpageAssistant(params) {
    this.itemHold = __bind(this.itemHold, this);
    this.itemTapped = __bind(this.itemTapped, this);
    this.itemTapped = __bind(this.itemTapped, this);
    this.handleActionSelection = __bind(this.handleActionSelection, this);
    this.loadMoreArticles = __bind(this.loadMoreArticles, this);
    this.handleDeleteItem = __bind(this.handleDeleteItem, this);
    this.filter = __bind(this.filter, this);    FrontpageAssistant.__super__.constructor.apply(this, arguments);
    this.articles = {
      items: []
    };
  }
  FrontpageAssistant.prototype.setup = function() {
    var back_button, menu_items;
    FrontpageAssistant.__super__.setup.apply(this, arguments);
    this.controller.setupWidget("spinner", this.attributes = {}, this.model = {
      spinning: true
    });
    back_button = this.showBackNavigation() ? {
      label: $L('Back'),
      icon: '',
      command: 'back',
      width: 80
    } : {};
    this.viewMenuModel = {
      visible: true,
      items: [
        back_button, {
          items: [{}, {}]
        }, {}
      ]
    };
    this.controller.setupWidget(Mojo.Menu.commandMenu, {
      menuClass: ''
    }, this.viewMenuModel);
    menu_items = [
      {
        label: "Manage User",
        items: [
          {
            label: "Login",
            command: 'login-cmd'
          }, {
            label: "Manage",
            command: 'manage-users-cmd'
          }, {
            label: "Register",
            command: 'register-cmd'
          }
        ]
      }, {
        label: "Preferences",
        command: Mojo.Menu.prefsCmd
      }, {
        label: "About",
        command: 'about-scene'
      }
    ];
    if (Mojo.appInfo.id === 'com.tehtorq.redditlater-hb') {
      menu_items = _.union([
        {
          label: "Donate",
          command: 'donation-cmd'
        }, {
          label: "Purchase",
          command: 'purchase-cmd'
        }
      ], menu_items);
    }
    this.controller.setupWidget(Mojo.Menu.appMenu, {
      omitDefaultItems: true
    }, {
      visible: true,
      items: menu_items
    });
    return this.controller.setupWidget("list", {
      itemTemplate: "frontpage/article",
      emptyTemplate: "list/empty_template",
      nullItemTemplate: "list/null_item_template"
    }, this.articles);
  };
  FrontpageAssistant.prototype.activate = function(event) {
    FrontpageAssistant.__super__.activate.apply(this, arguments);
    this.addListeners([this.controller.get("list"), Mojo.Event.listTap, this.itemTapped], [this.controller.get("list"), Mojo.Event.hold, this.itemHold], [this.controller.get("list"), Mojo.Event.listDelete, this.handleDeleteItem]);
    if (this.articles.items.length === 0) {
      return this.loadReadingList();
    }
  };
  FrontpageAssistant.prototype.deactivate = function(event) {
    return FrontpageAssistant.__super__.deactivate.apply(this, arguments);
  };
  FrontpageAssistant.prototype.cleanup = function(event) {
    return FrontpageAssistant.__super__.cleanup.apply(this, arguments);
  };
  FrontpageAssistant.prototype.filter = function(filterEvent) {
    if (filterEvent.filterString.length === 0) {
      return;
    }
    this.controller.get('filterfield').mojo.close();
    return this.searchReddit(filterEvent.filterString);
  };
  FrontpageAssistant.prototype.handleCallback = function(params) {
    var index;
    if (!((params != null) && params.success)) {
      return params;
    }
    index = -1;
    params.type = params.type.split(' ');
    this.spinSpinner(false);
    switch (params.type[0]) {
      case 'api-get':
        return this.handleloadReadingListResponse(params.response);
    }
  };
  FrontpageAssistant.prototype.handleDeleteItem = function(event) {
    this.unsaveArticle(event.item);
    return this.articles.items.splice(event.index, 1);
  };
  FrontpageAssistant.prototype.searchReddit = function(searchTerm) {
    return this.loadReadingList();
  };
  FrontpageAssistant.prototype.loadMoreArticles = function() {
    return this.loadReadingList();
  };
  FrontpageAssistant.prototype.displayLoadingButton = function() {
    this.controller.get('loadMoreButton').mojo.activate();
    this.activityButtonModel.label = "Loading";
    this.activityButtonModel.disabled = true;
    return this.controller.modelChanged(this.activityButtonModel);
  };
  FrontpageAssistant.prototype.loadReadingList = function() {
    return new Api(this).get();
  };
  FrontpageAssistant.prototype.handleloadReadingListResponse = function(response) {
    var items, json, length;
    if (response.readyState !== 4) {
      return;
    }
    length = this.articles.items.length;
    json = response.responseJSON;
    if (json == null) {
      return;
    }
    items = json.list;
    _.each(items, __bind(function(item) {
      return this.articles.items.push(item);
    }, this));
    this.controller.modelChanged(this.articles);
    this.spinSpinner(false);
    if (this.articles.items.length === 0) {
      return this.controller.get('list').mojo.noticeAddedItems(0, [null]);
    }
  };
  FrontpageAssistant.prototype.handleActionSelection = function(command) {
    var article, params;
    if (command == null) {
      return;
    }
    params = command.split(' ');
    switch (params[0]) {
      case 'open-link-cmd':
        article = this.articles.items[parseInt(params[1])];
        if (article.data.url != null) {
          return AppAssistant.open(article.data.url);
        } else {
          return this.controller.stageController.pushScene({
            name: "article"
          }, {
            article: article
          });
        }
        break;
      case 'readitlater-cmd':
        return this.readitlater(this.findArticleByName(params[1]));
    }
  };
  FrontpageAssistant.prototype.findArticleIndex = function(article_name) {
    var index;
    index = -1;
    _.each(this.articles.items, function(item, i) {
      if (item.data.name === article_name) {
        return index = i;
      }
    });
    return index;
  };
  FrontpageAssistant.prototype.findArticleByName = function(item_id) {
    return _.first(_.select(this.articles.items, function(article) {
      return article.item_id === item_id;
    }));
  };
  FrontpageAssistant.prototype.readitlater = function(article) {
    var params;
    params = {
      username: Preferences.username(),
      password: Preferences.password(),
      apikey: Preferences.apikey(),
      url: article.data.url
    };
    return new Article(this).readitlater(params);
  };
  FrontpageAssistant.prototype.itemTapped = function(event) {
    var article;
    article = event.item;
    return AppAssistant.open(article.url);
  };
  FrontpageAssistant.prototype.handleCommand = function(event) {
    var params;
    if (event.type !== Mojo.Event.command) {
      return;
    }
    params = event.command.split(' ');
    switch (params[0]) {
      case 'new-card':
        AppAssistant.openFrontpage("clone", {});
        break;
      case 'search':
        this.toggleSearch();
        break;
      case 'back':
        this.controller.stageController.popScene();
    }
    switch (event.command) {
      case Mojo.Menu.prefsCmd:
        return this.controller.stageController.pushScene({
          name: "prefs"
        }, {});
      case 'about-scene':
        return this.controller.stageController.pushScene({
          name: "about"
        }, {});
      case 'donation-cmd':
        return AppAssistant.open_donation_link();
      case 'purchase-cmd':
        return AppAssistant.open_purchase_link();
    }
  };
  FrontpageAssistant.prototype.itemTapped = function(event) {
    var article;
    article = event.item;
    return AppAssistant.open(article.url);
  };
  FrontpageAssistant.prototype.itemHold = function(event) {
    var article, thing;
    event.preventDefault();
    thing = event.srcElement.up('.palm-row');
    article = this.findArticleByName(thing.id);
    return this.controller.stageController.pushScene({
      name: "article",
      disableSceneScroller: true
    }, {
      article: article
    });
  };
  return FrontpageAssistant;
})();