var Api;
Api = (function() {
  function Api(callback) {
    this.callback = callback;
  }
  Api.prototype.get = function(params) {
    if (params == null) {
      params = {};
    }
    if (Preferences.apikey() === null || Preferences.apikey() === "" || Preferences.apikey() === void 0) {
      Banner.send("Require API key for this");
      return;
    }
    if (Preferences.username() === null || Preferences.username() === "") {
      Banner.send("Require username for this");
      return;
    }
    if (Preferences.password() === null || Preferences.password() === "") {
      Banner.send("Require password for this");
      return;
    }
    params = {
      username: Preferences.username(),
      password: Preferences.password(),
      apikey: Preferences.apikey(),
      format: 'json'
    };
    return new Request(this.callback).request('https://readitlaterlist.com/v2/get', 'get', params, 'api-get');
  };
  Api.prototype.text = function(params) {
    if (params == null) {
      params = {};
    }
    if (Preferences.apikey() === null || Preferences.apikey() === "") {
      Banner.send("Require API key for this");
      return;
    }
    params.apikey = Preferences.apikey();
    params.mode = 'more';
    params.images = '0';
    return new Request(this.callback).request('https://text.readitlaterlist.com/v2/text', 'get', params, 'api-text');
  };
  return Api;
})();