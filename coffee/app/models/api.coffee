class Api
  
  constructor: (callback) ->
    @callback = callback
  
  get: (params = {}) ->
    if Preferences.apikey() is null or Preferences.apikey() is "" or Preferences.apikey() is undefined
      Banner.send("Require API key for this")
      return
      
    if Preferences.username() is null or Preferences.username() is ""
      Banner.send("Require username for this")
      return

    if Preferences.password() is null or Preferences.password() is ""
      Banner.send("Require password for this")
      return
    
    params =
      username: Preferences.username()
      password: Preferences.password()
      apikey: Preferences.apikey()
      format: 'json'

    new Request(@callback).request('https://readitlaterlist.com/v2/get', 'get', params, 'api-get')
    
  text: (params = {}) ->
    if Preferences.apikey() is null or Preferences.apikey() is ""
      Banner.send("Require API key for this")
      return
      
    params.apikey = Preferences.apikey()
    params.mode = 'more'
    params.images = '0'
        
    new Request(@callback).request('https://text.readitlaterlist.com/v2/text', 'get', params, 'api-text')