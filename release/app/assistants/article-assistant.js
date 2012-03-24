var ArticleAssistant;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
ArticleAssistant = (function() {
  __extends(ArticleAssistant, PowerScrollBase);
  function ArticleAssistant(params) {
    this.handleTap = __bind(this.handleTap, this);
    this.handleDisplayTextVersion = __bind(this.handleDisplayTextVersion, this);
    this.handleContentLoaded = __bind(this.handleContentLoaded, this);    ArticleAssistant.__super__.constructor.apply(this, arguments);
    this.article = params.article;
  }
  ArticleAssistant.prototype.setup = function() {
    ArticleAssistant.__super__.setup.apply(this, arguments);
    return this.controller.setupWidget("progressbarId", {
      title: "Progress Bar",
      image: "images/header-icon.png",
      modelProperty: "progress"
    }, this.progressModel = {
      iconPath: "../images/progress-bar-background.png",
      progress: 0
    });
  };
  ArticleAssistant.prototype.activate = function(event) {
    ArticleAssistant.__super__.activate.apply(this, arguments);
    this.addListeners([this.controller.get("pages"), Mojo.Event.tap, this.handleTap], [this.controller.get("progressbarId"), Mojo.Event.progressComplete, this.handleContentLoaded]);
    return new Api(this).text({
      url: this.article.url
    });
  };
  ArticleAssistant.prototype.deactivate = function(event) {};
  ArticleAssistant.prototype.ready = function(event) {
    this.controller.get('buffer').style.width = "" + (this.controller.window.innerWidth - 20) + "px";
    this.sizePage(this.controller.select('.page')[0]);
    this.sizePage(this.controller.select('.page')[1]);
    return this.sizePage(this.controller.select('.page')[2]);
  };
  ArticleAssistant.prototype.sizePage = function(page) {
    page.style.width = "" + (this.controller.window.innerWidth - 20) + "px";
    return page.style.height = "" + (this.controller.window.innerHeight - 90) + "px";
  };
  ArticleAssistant.prototype.handleContentLoaded = function(event) {
    return this.displayPage(0);
  };
  ArticleAssistant.prototype.handleCallback = function(params) {
    if (!((params != null) && params.success)) {
      return params;
    }
    this.spinSpinner(false);
    switch (params.type) {
      case 'api-text':
        return this.handleDisplayTextVersion(params.response);
    }
  };
  ArticleAssistant.prototype.handleDisplayTextVersion = function(response) {
    if (response.readyState !== 4) {
      return;
    }
    this.text = response.responseText;
    this.text = this.text.replace(/<p>/g, "");
    this.text = this.text.replace(/<\/p>/g, "<br><br>");
    this.text = this.text.replace(/\r\n\r\n/g, "<br><br>");
    this.text = this.text.replace(/\n\n/g, "<br><br>");
    this.text = this.text.replace(/\r\n/g, " ");
    this.text = this.text.replace(/\n/g, " ");
    this.current_page_number = 0;
    this.start = 0;
    this.pages = new Array();
    this.count_pages = 0;
    this.text_length = this.text.length;
    this.char_count = 0;
    return this.controller.window.setTimeout(this.splitPages.bind(this), 1000);
  };
  ArticleAssistant.prototype.updateProgressBar = function() {
    this.progressModel.progress = this.char_count / this.text_length;
    return this.controller.modelChanged(this.progressModel);
  };
  ArticleAssistant.prototype.splitPages = function() {
    var count, got_a_page, page_text, text;
    text = this.text;
    count = 0;
    got_a_page = false;
    while (!got_a_page) {
      count += 10;
      page_text = text.substr(this.start, count);
      if (page_text === "") {
        return;
      }
      this.controller.get("buffer").update(page_text);
      if ((this.controller.get("buffer").getHeight() > (this.controller.window.innerHeight - 90)) || (this.start + count > this.text.length)) {
        this.char_count += count;
        this.updateProgressBar();
        this.pages.push(page_text);
        this.count_pages += 1;
        this.start += count;
        got_a_page = true;
      }
    }
    return this.controller.window.setTimeout(this.splitPages.bind(this), 33);
  };
  ArticleAssistant.prototype.displayPage = function(number) {
    this.current_page_number = number;
    this.setPageContent(this.controller.select('.page')[0], number - 1);
    this.setPageContent(this.controller.select('.page')[1], number);
    return this.setPageContent(this.controller.select('.page')[2], number + 1);
  };
  ArticleAssistant.prototype.setPageContent = function(element, page_number) {
    if (page_number < 0 || page_number >= this.pages.length) {
      return element.update("No content");
    } else {
      element.update("Nocontento");
      return element.update(this.pages[page_number]);
    }
  };
  ArticleAssistant.prototype.previousPage = function() {
    if (this.current_page_number === 0) {
      return;
    }
    this.controller.select('.page')[2].remove();
    this.controller.get('pages').insert({
      top: "<div class='page previous'></div>"
    });
    this.sizePage(this.controller.select('.page')[0]);
    this.displayPage(this.current_page_number - 1);
    return this.positionPages();
  };
  ArticleAssistant.prototype.nextPage = function() {
    if (this.current_page_number === this.pages.length - 1) {
      return;
    }
    this.controller.select('.page')[0].remove();
    this.controller.get('pages').insert({
      bottom: "<div class='page next'></div>"
    });
    this.sizePage(this.controller.select('.page')[2]);
    this.displayPage(this.current_page_number + 1);
    return this.positionPages();
  };
  ArticleAssistant.prototype.positionPages = function() {
    this.controller.select('.page')[0].style.left = '-300px';
    this.controller.select('.page')[1].style.left = '10px';
    return this.controller.select('.page')[2].style.left = '320px';
  };
  ArticleAssistant.prototype.handleTap = function(event) {
    event.preventDefault();
    if (event.down.x < this.controller.window.innerWidth / 3) {
      return this.previousPage();
    } else if (event.down.x > this.controller.window.innerWidth - this.controller.window.innerWidth / 3) {
      return this.nextPage();
    }
  };
  return ArticleAssistant;
})();