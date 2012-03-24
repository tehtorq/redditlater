var Preferences;
Preferences = (function() {
  function Preferences() {}
  Preferences.apikey = function(apikey) {
    if (apikey != null) {
      new Mojo.Model.Cookie("prefs-readitlater-apikey").put(apikey);
    }
    return StageAssistant.cookieValue("prefs-readitlater-apikey", "c25d9l36T62f6bf58fA47fvD3cg0Pr91");
  };
  Preferences.username = function(username) {
    if (username != null) {
      new Mojo.Model.Cookie("prefs-readitlater-username").put(username);
    }
    return StageAssistant.cookieValue("prefs-readitlater-username", '');
  };
  Preferences.password = function(password) {
    if (password != null) {
      new Mojo.Model.Cookie("prefs-readitlater-password").put(password);
    }
    return StageAssistant.cookieValue("prefs-readitlater-password", '');
  };
  return Preferences;
})();