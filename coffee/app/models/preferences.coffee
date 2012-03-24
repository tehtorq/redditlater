class Preferences
  
  @apikey: (apikey) ->
    new Mojo.Model.Cookie("prefs-readitlater-apikey").put(apikey) if apikey?
    StageAssistant.cookieValue("prefs-readitlater-apikey", "c25d9l36T62f6bf58fA47fvD3cg0Pr91")
    
  @username: (username) ->
    new Mojo.Model.Cookie("prefs-readitlater-username").put(username) if username?
    StageAssistant.cookieValue("prefs-readitlater-username", '')
    
  @password: (password) ->
    new Mojo.Model.Cookie("prefs-readitlater-password").put(password) if password?
    StageAssistant.cookieValue("prefs-readitlater-password", '')
