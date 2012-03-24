class ArticleAssistant extends PowerScrollBase

  constructor: (params) ->
    super
    @article = params.article

  setup: ->
    super
    
    @controller.setupWidget("progressbarId",
      {
        title: "Progress Bar",
        image: "images/header-icon.png",
        modelProperty: "progress"
      },
      @progressModel = {
        iconPath: "../images/progress-bar-background.png",
        progress: 0
      }
    )
    
  activate: (event) ->
    super
    
    @addListeners(
      [@controller.get("pages"), Mojo.Event.tap, @handleTap]
      [@controller.get("progressbarId"), Mojo.Event.progressComplete, @handleContentLoaded]
    )

    # @spinSpinner(true)
    new Api(@).text({url: @article.url})
    
    # @text = 'The OpenGL Extension Wrangler Library
    # 
    # Automatic Code Generation
    # 
    # Starting from release 1.1.0, the source code and parts of the documentation are automatically generated from the extension specifications in a two-step process. In the first step, specification files from the OpenGL registry are downloaded and parsed. Skeleton descriptors are created for each extension. These descriptors contain all necessary information for creating the source code and documentation in a simple and compact format, including the name of the extension, url link to the specification, tokens, function declarations, typedefs and struct definitions. In the second step, the header files as well as the library and glewinfo source are generated from the descriptor files. The code generation scripts are located in the auto subdirectory.
    # The code generation scripts require GNU make, wget, and perl. On Windows, the simplest way to get access to these tools is to install Cygwin, but make sure that the root directory is mounted in binary mode. The makefile in the auto directory provides the following build targets:
    # make        Create the source files from the descriptors. If the descriptors do not exist, create them from the spec files. If the spec files do not exist, download them from the OpenGL repository.
    # make clean        Delete the source files.
    # make clobber        Delete the source files and the descriptors.
    # make destroy        Delete the source files, the descriptors, and the spec files.
    # make custom       Create the source files for the extensions listed in auto/custom.txt. See "Custom Code Generation" below for more details.
    # Adding a New Extension
    # 
    # To add a new extension, create a descriptor file for the extension in auto/core and rerun the code generation scripts by typing make clean; make in the auto directory.
    # The format of the descriptor file is given below. Items in brackets are optional.
    # <Extension Name>
    # [<URL of Specification File>]
    #     [<Token Name> <Token Value>]
    #     [<Token Name> <Token Value>]
    #     ...
    #     [<Typedef>]
    #     [<Typedef>]
    #     ...
    #     [<Function Signature>]
    #     [<Function Signature>]
    #     ...
    # Take a look at one of the files in auto/core for an example. Note that typedefs and function signatures should not be terminated with a semicolon.
    # Custom Code Generation
    # 
    # Starting from GLEW 1.3.0, it is possible to control which extensions to include in the libarary by specifying a list in auto/custom.txt. This is useful when you do not need all the extensions and would like to reduce the size of the source files. Type make clean; make custom in the auto directory to rerun the scripts with the custom list of extensions.
    # For example, the following is the list of extensions needed to get GLEW and the utilities to compile.
    # WGL_ARB_extensions_string
    # WGL_ARB_multisample
    # WGL_ARB_pixel_format
    # WGL_ARB_pbuffer
    # WGL_EXT_extensions_string
    # WGL_ATI_pixel_format_float
    # WGL_NV_float_buffer
    # Multiple Rendering Contexts (GLEW MX)
    # 
    # Starting with release 1.2.0, thread-safe support for multiple rendering contexts, possibly with different capabilities, is available. Since this is not required by most users, it is not added to the binary releases to maintain compatibility between different versions. To include multi-context support, you have to do the following:
    # Compile and use GLEW with the GLEW_MX preprocessor token defined.
    # For each rendering context, create a GLEWContext object that will be available as long as the rendering context exists.
    # Define a macro or function called glewGetContext() that returns a pointer to the GLEWContext object associated with the rendering context from which OpenGL/WGL/GLX calls are issued. This dispatch mechanism is primitive, but generic.
    # Make sure that you call glewInit() after creating the GLEWContext object in each rendering context. Note, that the GLEWContext pointer returned by glewGetContext() has to reside in global or thread-local memory.
    # Note that according to the MSDN WGL documentation, you have to initialize the entry points for every rendering context that use pixel formats with different capabilities For example, the pixel formats provided by the generic software OpenGL implementation by Microsoft vs. the hardware accelerated pixel formats have different capabilities. GLEW by default ignores this requirement, and does not define per-context entry points (you can however do this using the steps described above). Assuming a global namespace for the entry points works in most situations, because typically all hardware accelerated pixel formats provide the same entry points and capabilities. This means that unless you use the multi-context version of GLEW, you need to call glewInit() only once in your program, or more precisely, once per process.
    # Separate Namespace
    # 
    # To avoid name clashes when linking with libraries that include the same symbols, extension entry points are declared in a separate namespace (release 1.1.0 and up). This is achieved by aliasing OpenGL function names to their GLEW equivalents. For instance, glFancyFunction is simply an alias to glewFancyFunction. The separate namespace does not effect token and function pointer definitions.
    # Known Issues
    # 
    # GLEW requires GLX 1.2 for compatibility with GLUT.'
    # 
    # @handleDisplayTextVersion({responseText: @text, readyState: 4})
    
  deactivate: (event) ->
    #@controller.window.clearInterval(@timerID)      
    
  ready: (event) ->
    @controller.get('buffer').style.width = "#{@controller.window.innerWidth - 20}px"
    @sizePage(@controller.select('.page')[0])
    @sizePage(@controller.select('.page')[1])
    @sizePage(@controller.select('.page')[2])
    
  sizePage: (page) ->
    page.style.width = "#{@controller.window.innerWidth - 20}px"
    page.style.height = "#{@controller.window.innerHeight - 90}px"
    
  handleContentLoaded: (event) =>
    @displayPage(0)
    
  handleCallback: (params) ->
    return params unless params? and params.success
    
    @spinSpinner(false)
    
    switch params.type
      when 'api-text'
        @handleDisplayTextVersion(params.response)
      
  handleDisplayTextVersion: (response) =>
    return if response.readyState isnt 4
    
    @text = response.responseText
    @text = @text.replace(/<p>/g, "")
    @text = @text.replace(/<\/p>/g, "<br><br>")
    @text = @text.replace(/\r\n\r\n/g, "<br><br>")
    @text = @text.replace(/\n\n/g, "<br><br>")
    @text = @text.replace(/\r\n/g, " ")
    @text = @text.replace(/\n/g, " ")
    @current_page_number = 0
    @start = 0
    @pages = new Array()
    @count_pages = 0
    @text_length = @text.length
    @char_count = 0
    
    @controller.window.setTimeout(@splitPages.bind(@), 1000)
    
  updateProgressBar: ->
    @progressModel.progress = @char_count / @text_length
    @controller.modelChanged(@progressModel)
    
  splitPages: ->
    text = @text
    count = 0
    got_a_page = false
    
    while not got_a_page
      count += 10
      page_text = text.substr(@start, count)      
      return if page_text is ""
      
      @controller.get("buffer").update(page_text)
      
      if (@controller.get("buffer").getHeight() > (@controller.window.innerHeight - 90)) or (@start + count > @text.length)
        @char_count += count
        @updateProgressBar()
        @pages.push page_text
        @count_pages += 1
        @start += count
        got_a_page = true
      
    @controller.window.setTimeout(@splitPages.bind(@),33)
    
  displayPage: (number) ->
    @current_page_number = number
    @setPageContent(@controller.select('.page')[0], number - 1)
    @setPageContent(@controller.select('.page')[1], number)
    @setPageContent(@controller.select('.page')[2], number + 1)
    
  setPageContent: (element, page_number) ->
    if page_number < 0 or page_number >= @pages.length
      element.update("No content") 
    else
      element.update("Nocontento") 
      element.update(@pages[page_number])
      
  previousPage: ->
    return if @current_page_number is 0
    @controller.select('.page')[2].remove()
    @controller.get('pages').insert({top: "<div class='page previous'></div>"})
    @sizePage(@controller.select('.page')[0])
    @displayPage(@current_page_number - 1)
    @positionPages()
    
  nextPage: ->
    return if @current_page_number is @pages.length - 1
    @controller.select('.page')[0].remove()
    @controller.get('pages').insert({bottom: "<div class='page next'></div>"})
    @sizePage(@controller.select('.page')[2])
    @displayPage(@current_page_number + 1)
    @positionPages()
    
  positionPages: ->
    @controller.select('.page')[0].style.left = '-300px'
    @controller.select('.page')[1].style.left = '10px'
    @controller.select('.page')[2].style.left = '320px'
    
  handleTap: (event) =>
    event.preventDefault()
    
    if event.down.x < @controller.window.innerWidth / 3
      @previousPage()
    else if event.down.x > @controller.window.innerWidth - @controller.window.innerWidth / 3
      @nextPage()
      