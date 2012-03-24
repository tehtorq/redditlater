class PrefsAssistant extends BaseAssistant
  
  constructor: (params) ->
    super

  setup: ->
    super
    
    apikey = Preferences.apikey()
    username = Preferences.username()
    password = Preferences.password()
    
    @controller.setupWidget "readitlaterUsernameTextFieldId", { 
      focusMode: Mojo.Widget.focusSelectMode
      textCase: Mojo.Widget.steModeLowerCase, maxLength : 30
      }
      {value: username}

    @controller.setupWidget "readitlaterPasswordTextFieldId", {
      focusMode : Mojo.Widget.focusSelectMode
      textCase : Mojo.Widget.steModeLowerCase, maxLength : 30
      },
      {value: password}
      
    @controller.setupWidget "readitlaterAPIkeyTextFieldId", {
      focusMode: Mojo.Widget.focusSelectMode
      textCase: Mojo.Widget.steModeLowerCase, maxLength : 30
      }
      {value: apikey}
    
    if @showBackNavigation()
      @viewMenuModel =
        {
          visible: true,
          items: [
            {label: $L('Back'), icon:'', command:'back', width:80}
          ]
        }
    
      @controller.setupWidget(Mojo.Menu.commandMenu, { menuClass:'no-fade' }, @viewMenuModel)

  activate: (event) ->
    super
    
    @addListeners(
      [@controller.get("readitlaterUsernameTextFieldId"), Mojo.Event.propertyChange, @handleUpdateUsername]
      [@controller.get("readitlaterPasswordTextFieldId"), Mojo.Event.propertyChange, @handleUpdatePassword]
      [@controller.get("readitlaterAPIkeyTextFieldId"), Mojo.Event.propertyChange, @handleUpdateApikey]
    )
  
  ready: ->
    @controller.setInitialFocusedElement(null)
  
  handleUpdateUsername: (event) =>
    Preferences.username(event.value)

  handleUpdatePassword: (event) =>
    Preferences.password(event.value)

  handleUpdateApikey: (event) =>
    Preferences.apikey(event.value)

  handleCommand: (event) ->
    return unless event.type is Mojo.Event.command

    switch event.command
      when 'back'
        @controller.stageController.popScene()
          