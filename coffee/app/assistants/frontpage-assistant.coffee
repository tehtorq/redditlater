class FrontpageAssistant extends PowerScrollBase
  
  constructor: (params) ->
    super
    @articles = { items : [] }

  setup: ->
    super
    
    @controller.setupWidget "spinner", @attributes = {}, @model = {spinning: true}
    
    back_button = if @showBackNavigation()
      {label: $L('Back'), icon:'', command:'back', width:80}
    else
      {}
  
    @viewMenuModel =
      visible: true
      items: [
        back_button
        items: [
          {}
          {}
        ]
        {}
      ]
        
    @controller.setupWidget(Mojo.Menu.commandMenu, { menuClass:'' }, @viewMenuModel)
  
    menu_items = [
      {label: "Manage User", items:
        [
          {label: "Login", command: 'login-cmd'}
          {label: "Manage", command: 'manage-users-cmd'}
          {label: "Register", command: 'register-cmd'}
          #{label: "Logout", command: 'logout-cmd'}
        ]}
      {label: "Preferences", command: Mojo.Menu.prefsCmd}
      {label: "About", command: 'about-scene'}
    ]
    
    if Mojo.appInfo.id is 'com.tehtorq.redditlater-hb'
      menu_items = _.union([
        {label: "Donate", command: 'donation-cmd'}
        {label: "Purchase", command: 'purchase-cmd'}
      ], menu_items)

    @controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, {visible: true, items: menu_items})

    @controller.setupWidget("list", {
      itemTemplate: "frontpage/article"
      emptyTemplate: "list/empty_template"
      nullItemTemplate: "list/null_item_template"
      #swipeToDelete: true
      }, @articles)
  
  activate: (event) ->
    super
    
    @addListeners(
      [@controller.get("list"), Mojo.Event.listTap, @itemTapped]
      [@controller.get("list"), Mojo.Event.hold, @itemHold]
      [@controller.get("list"), Mojo.Event.listDelete, @handleDeleteItem]
    )

    @loadReadingList() if @articles.items.length is 0

  deactivate: (event) ->
    super
  
  cleanup: (event) ->
    super
    
  filter: (filterEvent) =>
    return if filterEvent.filterString.length is 0
    
    @controller.get('filterfield').mojo.close()
    @searchReddit(filterEvent.filterString)
  
  handleCallback: (params) ->    
    return params unless params? and params.success
    
    index = -1
    params.type = params.type.split(' ')
    
    @spinSpinner(false)

    switch params.type[0]
      when 'api-get'
        @handleloadReadingListResponse(params.response)

  handleDeleteItem: (event) =>
    @unsaveArticle(event.item)
    @articles.items.splice(event.index, 1)
  
  searchReddit: (searchTerm) ->
    @loadReadingList()
  
  loadMoreArticles: =>
    @loadReadingList()
  
  displayLoadingButton: ->
    @controller.get('loadMoreButton').mojo.activate()
    @activityButtonModel.label = "Loading"
    @activityButtonModel.disabled = true
    @controller.modelChanged(@activityButtonModel)
  
  loadReadingList: ->
    new Api(@).get()
    
  handleloadReadingListResponse: (response) ->
    return if response.readyState isnt 4
    length = @articles.items.length
    json = response.responseJSON
  
    return unless json?
    
    items = json.list
    
    _.each items, (item) => @articles.items.push(item)
    @controller.modelChanged(@articles)
    @spinSpinner(false)
    @controller.get('list').mojo.noticeAddedItems(0, [null]) if @articles.items.length is 0
  
  handleActionSelection: (command) =>
    return unless command?
    
    params = command.split ' '
  
    switch params[0]
      when 'open-link-cmd'
        article = @articles.items[parseInt(params[1])]
        
        if article.data.url?
          AppAssistant.open(article.data.url)
        else
          @controller.stageController.pushScene({name:"article"}, {article: article})
      when 'readitlater-cmd'
        @readitlater(@findArticleByName(params[1]))
  
  findArticleIndex: (article_name) ->
    index = -1
    
    _.each @articles.items, (item, i) ->
      index = i if item.data.name is article_name
  
    index
    
  findArticleByName: (item_id) ->
    _.first _.select @articles.items, (article) -> article.item_id is item_id
    
  readitlater: (article) ->
    params = 
      username: Preferences.username()
      password: Preferences.password()
      apikey: Preferences.apikey()
      url: article.data.url

    new Article(@).readitlater(params)
    
  itemTapped: (event) =>
    article = event.item
    AppAssistant.open(article.url)
  
  handleCommand: (event) ->
    return if event.type isnt Mojo.Event.command
  
    params = event.command.split(' ')
  
    switch params[0]
      when 'new-card'
        AppAssistant.openFrontpage("clone", {})
      when 'search'
        @toggleSearch()
      when 'back'
        @controller.stageController.popScene()
    
    switch event.command
      when Mojo.Menu.prefsCmd
        @controller.stageController.pushScene({name:"prefs"}, {})
      when 'about-scene'
        @controller.stageController.pushScene({name:"about"}, {})
      when 'donation-cmd'
        AppAssistant.open_donation_link()
      when 'purchase-cmd'
        AppAssistant.open_purchase_link()
        
  itemTapped: (event) =>
    article = event.item
    AppAssistant.open(article.url)

  itemHold: (event) =>
    event.preventDefault()
    thing = event.srcElement.up('.palm-row')
    article = @findArticleByName(thing.id)
    
    @controller.stageController.pushScene({name:"article", disableSceneScroller: true}, {article: article})
    