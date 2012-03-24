class AppAssistant
  
  handleLaunch: (params) ->    
    Mojo.Log.info("app #{Mojo.appInfo.id} launched with:")
    Mojo.Log.info JSON.stringify(params)
    
    if params.searchString
      AppAssistant.openFrontpage("clone", {search: params.searchString})
    else
      if @shouldDisplayAboutScene()
        AppAssistant.cloneCard(null, {name:"about"}, {skip: true})
      else
        AppAssistant.openFrontpage("clone", {})
  
  shouldDisplayAboutScene: ->
    if Mojo.appInfo.id is 'com.tehtorq.redditlater-hb'
      if cookie = new Mojo.Model.Cookie("show-about-screen")
        value = cookie.get()
        return true if value is undefined
    false

  @cloneCard = (controller, sceneArguments, sceneParameters) ->
    sceneParameters or= {}
    samecard = StageAssistant.cookieValue("prefs-samecard", "off")
  
    if controller? and (samecard is "on") and (StageAssistant.stages.length > 0)
      controller.stageController.pushScene(sceneArguments, sceneParameters)
      return
  
    # only allow one card for prefs and about scenes
  
    if sceneArguments? and (sceneArguments.name in ['prefs','about'])
      stageController = Mojo.Controller.getAppController().getStageController(sceneArguments.name)
    
      if stageController?
        stageController.activate()
        return
        
    cardname = "card" + Math.floor(Math.random()*10000)
    cardname = sceneArguments.name if sceneArguments? and (sceneArguments.name in ['prefs','about'])

    pushCard = (stageController) =>
      if sceneArguments?
        stageController.pushScene(sceneArguments, sceneParameters)
      else
        stageController.pushScene("frontpage",{})
  
    StageAssistant.stages.push(cardname)
    Mojo.Controller.getAppController().createStageWithCallback({name: cardname, lightweight: true}, pushCard, "card")
    
  @open: (url) ->
    new Mojo.Service.Request("palm://com.palm.applicationManager", {
      method: "open",
      parameters:
        target: url
        onSuccess: ->
        onFailure: ->
      })
      
  @open_donation_link: ->
    @open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BNANW6F5RNWD6")
    
  @open_purchase_link: ->
    @open("http://developer.palm.com/appredirect/?packageid=com.tehtorq.redditlater")
  
  @deviceIsTouchPad: ->
    return true if Mojo.Environment.DeviceInfo.modelNameAscii.indexOf("ouch") > -1
    return true if Mojo.Environment.DeviceInfo.screenWidth is 1024
    return true if Mojo.Environment.DeviceInfo.screenHeight is 1024
    false
    
  @openFrontpage: (type, params = {}, controller) ->
    if type is "clone"
      AppAssistant.cloneCard(controller, {name:"frontpage"}, params)
    else if type is "swap"
      controller.stageController.swapScene({name: "frontpage"}, params)
