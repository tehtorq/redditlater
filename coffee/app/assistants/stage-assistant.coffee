class StageAssistant

  @cookieValue: (cookieName, default_value) ->
    new Mojo.Model.Cookie(cookieName)?.get() or default_value

  @cloneImageCard: (assistant, article) ->
    lowercase_subreddit = article.data.subreddit.toLowerCase()
    article.url = Linky.parse(article.data.url) if article.kind?
  
    if lowercase_subreddit in ['gif','gifs','nsfw_gif','nsfw_gifs'] or article.url.url.endsWith('.gif')
      AppAssistant.cloneCard(assistant.controller, {name:"gif"},{index:0,images:[article.url.url], articles: [article]})
    else
      AppAssistant.cloneCard(assistant.controller, {name:"image"},{index:0,images:[article.url.url], articles: [article]})

  @stages = []
  
  @switchTheme: (new_theme_path, old_theme_path) ->
    appController = Mojo.Controller.getAppController()
    
    _.each @stages, (stage) ->
      controller = appController.getStageController(stage)
    
      if controller?
        controller.unloadStylesheet(old_theme_path)
        controller.loadStylesheet(new_theme_path)

  @timeFormatter = (time) ->
    newDate = new Date()
    lapsed = newDate.getTime() / 1000 - time
    units = Math.floor(lapsed / 60)

    if units < 60
      return if units is 1 then units.toString() + ' minute ago' else units.toString() + ' minutes ago'

    units = Math.floor(units / 60)

    if units < 24
      return if units is 1 then units.toString() + ' hour ago' else units.toString() + ' hours ago'

    units = Math.floor(units / 24)

    return if units is 1 then units.toString() + ' day ago' else units.toString() + ' days ago'
    
  @defaultWindowOrientation: (assistant, orientation) ->
    value = StageAssistant.cookieValue("prefs-lock-orientation", "off")
  
    if value is "on"
      assistant.controller.stageController.setWindowOrientation("up")
    else
      assistant.controller.stageController.setWindowOrientation(orientation)
