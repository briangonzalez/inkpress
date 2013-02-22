// App View
// ----------
var InkApp = Backbone.View.extend({

  // Body is our element.
  el: $('body'),

  // The DOM events specific to an item.
  events: function(){
    var events = {};

    events[ $.ink.startEvent + " " +  'footer .login a' ]   = 'showLogin';
    events[ $.ink.startEvent + " " +  '.no-posts .login' ]  = 'showLogin';
    events[ $.ink.startEvent + " " +  '.nav-icon-wrap' ]    = 'toggleSmallNav';
    events[ $.ink.startEvent ]  = 'handleClickAway';
    events[ 'keydown' ]  = 'handleKeyDown';

    return events;
  },

  initialize: function(){
    // The ever elusive fullscreen hack.
    setTimeout(function(){ window.scrollTo(0, 0) }, 0);

    this.$smallNav      = this.$el.find('nav.main');
    this.$imgs          = this.$el.find('div[role=main] article img.scale');

    this.setUnderscoreInterpolation();
    this.scaleImages();
  },

  showLogin: function(ev){
    ev && ev.preventDefault();
    new $.ink.views.Login().render();
  },

  closeDialog: function(){
    $('.ink-admin-dialog').remove();
  },

  delayedReload: function(time){
    time = time || 300;
    setTimeout(function(){
      location.reload(true);
    }, time)
  },

  setUnderscoreInterpolation: function(){
    // Underscore Templates
    _.templateSettings = {
      evaluate:    /\{\%([\s\S]+?)\%\}/g,             // {% console.log("blah") %}
      interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g,  // {{ title }}
      escape:      /\{\{\{([\s\S]+?)\}\}\}/g,         // {{{ title }}}
    }
  },

  toggleSmallNav: function(ev){
    ev.preventDefault();
    this.$smallNav.toggle();
  },

  ajaxSetup: function(){
    $.ajaxSetup ({
      // Disable caching of AJAX responses
      cache: false
    });
  },

  handleClickAway: function(ev){
    var $el             = $(ev.target);
    var isDialog        = $el.is('.ink-admin-dialog');
    var isLink          = $el.is('a');
    var isIcon          = $el.is('i');
    var isChildOfDialog = $el.parents('.ink-admin-dialog').length > 0
    
    if ( !(isDialog || isChildOfDialog || isLink || isIcon) ){
      this.closeDialog();
    }
  },

  handleKeyDown: function(ev){

    switch (ev.which) { 
     case 65:                                     // [CMD + A] - Show actions
      if ( ev.metaKey && $.ink.admin && $.ink.admin.edit.editing == "false" ){
        ev.preventDefault();
        $.ink.admin.views.App.showActions();
      }  
      break;
    case 76:                                      // [CMD + L] - Show login
      if ( ev.metaKey && !$.ink.admin ){
        ev && ev.preventDefault();
        this.showLogin();
      }  
      break;
    case 80:                                      // [CMD + P] - Toggle preview
      if ( ev.metaKey && $.ink.admin ){
        ev.preventDefault();
        $.ink.admin.views.Edit.preview();
      }  
      break;
    case 27:                                      // [ESC] - Hide dialog
      ev.preventDefault();
      this.closeDialog();
      break;
    }
  },

  scaleImages: function(){
    $.each( this.$imgs, function(obj, el){
      var $el = $(el);
      $el.css({ width: 'auto' })
      var width;
      $el.load(function(){ 
        $this = $(this);
        width = $this.width();
        $this.css({ maxWidth: width, width: '100%' })
      });
    })
  }

});