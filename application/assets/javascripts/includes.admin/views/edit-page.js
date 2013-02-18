

// Admin View
// ----------
var InkAdminEdit = Backbone.View.extend({

  // Body is our element.
  el: $('.admin-edit-page'),

  // The DOM events specific to an item.
  events: function(){
    var events = {};

    events[ 'keyup .code' ]                               = 'savePage'; 
    events[ $.ink.startEvent + ' .code']                  = 'hideIframe'; 
    events[ $.ink.startEvent + ' .controls .save']        = "savePage";
    events[ $.ink.startEvent + ' .controls .preview']     = "preview";
    events[ $.ink.startEvent + ' .controls .files']       = "showFiles";
    events[ $.ink.startEvent + ' .controls .short-url']   = "showShortURL";
    events[ $.ink.startEvent + ' .toggle-zen']            = "toggleZen";
    events[ $.ink.startEvent + ' .toggle-color']          = "toggleColor";

    return events;
  },

  initialize: function(){
    this.$iframeWrap      = this.$el.find('.admin-preview');
    this.$iframe          = this.$el.find('.admin-preview iframe');
    this.$code            = this.$el.find('.code').focus();
    this.$preview         = this.$el.find('a.control.preview');
    this.$files           = this.$el.find('a.control.files');
    this.$save            = this.$el.find('a.control.save');
    this.$exit            = this.$el.find('a.control.exit');
    this.$progress        = this.$el.find('.save-progress');
    this.$zenControls     = this.$el.find('.zen-controls');
  
    this.saveInterval     = 1500;
    this.instantiateTextArea();
  },

  instantiateTextArea: function(){
    var el = this.$code[0];
    var editor = new Behave({
      textarea: el,
      replaceTab: true,
      softTabs: true,
      softTabSize: 2,
      autoOpen: true,
      overwrite: true,
      autoStrip: true,
      autoIndent: true,
      fence: false
    });
  },

  savePage: function(ev){

    if (ev.which == 91) return; 

    var self      = this;
    var content   = this.$el.find('.code').val();
    var preview   = false;
    var interval  = this.saveInterval;

    if (ev.type == 'keyup'){
      preview = true;
      this.startProgress();

      if (this.saveTimeout)
        clearTimeout(this.saveTimeout);
    } else{
      interval = 0
    }

    this.saveTimeout = setTimeout(function(){
      $.ajax({
        url:  $.ink.Routes.admin.savePage,
        type:   'POST',
        data: { content:    content, 
                path:       $.ink.admin.edit.path,
                page:       $.ink.admin.edit.page, 
                preview:    preview 
              },
        success:  function(data){
          self.refreshIframe();
          self.resetProgress();

          if (!preview) 
            self.highlightSave();
        }
      });
    }, interval);
  },

  showFiles: function(){
    new $.ink.admin.views.EditFiles().render();
  },

  showShortURL: function(){
    new $.ink.admin.views.ShortURL().render();
  },

  startEditingFile: function(content, file, main){
    this.savePage({ type: 'ui' });

    $.ink.views.App.closeDialog();
    clearTimeout(this.saveTimeout);

    $.ink.admin.edit.page = main ? false : file;
    this.$code.val(content).focus();
  },

  startProgress: function(){
    var self = this;
    this.$progress.removeClass('animate');

    setTimeout(function(){ 
      self.$progress.addClass('animate');
    }, 100)
  },

  toggleZen: function(ev){
    this.$zenControls.toggleClass('on');
    this.$code.toggleClass('zen');

    if (!this.$code.hasClass('zen')){
      this.$code.removeClass('night');
    }
  },

  toggleColor: function(ev){
    this.$code.toggleClass('night');
  },

  resetProgress: function(){
    this.$progress.removeClass('animate');
  },

  refreshIframe: function(){
    if ( this.$iframe.length > 0 )
      this.$iframe[0].contentDocument.location.reload(true);
  },

  preview: function(ev){
    var self = this;
    if (ev) ev.preventDefault();

    this.$preview.addClass('highlight');
    setTimeout(function(){
      self.$preview.removeClass('highlight');
    }, 300);

    this.$iframeWrap.toggleClass('in-focus');
  },
  
  hideIframe: function(ev){
    ev.preventDefault();
    this.$iframeWrap.removeClass('in-focus');
  },

  highlightSave: function(){
    var $i = this.$save.find('i'); 
    var oldClass = $i.attr('class');
    $i.removeClass(oldClass);
    $i.addClass('icon-ok')

    setTimeout(function(){
      $i.removeClass('icon-ok');
      $i.addClass( oldClass );
    }, 1000)
  }

});