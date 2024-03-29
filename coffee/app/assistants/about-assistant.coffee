class AboutAssistant extends BaseAssistant
  
  constructor: (params) ->
    super
    @params = params
  
  setup: ->
    super
    
    if @params?.skip is true
      @viewMenuModel = {
        visible: true,
        items: [
          {}
          {label: $L('Continue'), command: 'continue', icon: ""}
          {}
        ]
      }
      
      @controller.setupWidget(Mojo.Menu.commandMenu, { menuClass:'no-fade' }, @viewMenuModel)
    else
      if @showBackNavigation()
        @viewMenuModel = {
          visible: true,
          items: [
            {label: $L('Back'), icon:'', command:'back', width:80}
          ]
        }

        @controller.setupWidget(Mojo.Menu.commandMenu, { menuClass:'no-fade' }, @viewMenuModel)
      
      @controller.setupWidget(Mojo.Menu.appMenu, {}, {visible: true, items: [{label: "Feedback", command: 'feedback-cmd'}]})
  
  ready: ->
    expiration = new Date(new Date().getTime() + 2 * 24 * 60 * 60000)
    new Mojo.Model.Cookie("show-about-screen").put(expiration, expiration)
    
  handleCommand: (event) ->
    return if event.type isnt Mojo.Event.command

    switch event.command
      when 'top'
        @scrollToTop()
      when 'back'
        @controller.stageController.popScene()
      when 'continue'
        AppAssistant.openFrontpage("swap", {}, @controller)
      when 'feedback-cmd'
        @mail()
        
  mail: ->
    @controller.serviceRequest(
      "palm://com.palm.applicationManager",
      {
        method: 'open'
        parameters:
          id: "com.palm.app.email",
          params:
            summary: 'redditlater feedback',
            text: '',
            recipients: [{
              type:"email",
              role:1,
              value:"i.am.douglas.anderson@gmail.com",
              contactDisplay:"redditlater"
            }]
      }
    )
