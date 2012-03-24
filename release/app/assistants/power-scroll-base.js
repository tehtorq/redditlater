var PowerScrollBase;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
PowerScrollBase = (function() {
  __extends(PowerScrollBase, BaseAssistant);
  function PowerScrollBase() {
    PowerScrollBase.__super__.constructor.apply(this, arguments);
    this.twoFingerStartBound = this.twoFingerStart.bind(this);
    this.twoFingerEndBound = this.twoFingerEnd.bind(this);
  }
  PowerScrollBase.prototype.setup = function() {
    return PowerScrollBase.__super__.setup.apply(this, arguments);
  };
  PowerScrollBase.prototype.activate = function() {
    PowerScrollBase.__super__.activate.apply(this, arguments);
    Mojo.Event.listen(this.controller.document, "gesturestart", this.twoFingerStartBound);
    return Mojo.Event.listen(this.controller.document, "gestureend", this.twoFingerEndBound);
  };
  PowerScrollBase.prototype.deactivate = function() {
    PowerScrollBase.__super__.deactivate.apply(this, arguments);
    Mojo.Event.stopListening(this.controller.document, "gesturestart", this.twoFingerStartBound);
    return Mojo.Event.stopListening(this.controller.document, "gestureend", this.twoFingerEndBound);
  };
  PowerScrollBase.prototype.cleanup = function() {
    return PowerScrollBase.__super__.cleanup.apply(this, arguments);
  };
  PowerScrollBase.prototype.twoFingerStart = function(event) {
    return this.gestureStartY = event.centerY;
  };
  PowerScrollBase.prototype.twoFingerEnd = function(event) {
    var gestureDistanceY, scroller;
    gestureDistanceY = event.centerY - this.gestureStartY;
    scroller = this.controller.getSceneScroller();
    if (gestureDistanceY > 0) {
      return scroller.mojo.revealTop();
    } else if (gestureDistanceY < 0) {
      return scroller.mojo.revealBottom();
    }
  };
  return PowerScrollBase;
})();