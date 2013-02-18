

var InkAdminLoginDialog = Backbone.View.extend({
  events: function(){
    var events = {};

    events[ $.ink.startEvent + " " + '.login' ]          = 'login';
    events[ $.ink.startEvent + " " + '.generate-key' ]    = 'showGenerateKey';
    events[ $.ink.startEvent + " " + '.close']           = 'remove';
    events[ 'keydown input' ] = 'handleEnter';

    return events;
  }, 

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.login');
    this.$el.html(t);
    $('body').append(this.$el);
    this.afterRender()
    return this;
  },

  afterRender: function(){
    this.$el.find('.username').focus()
  },

  login: function(){
    var self      = this;
    var username  = this.$el.find(".username").val();
    var password  = this.$el.find(".password").val();
    var $heading  = this.$el.find("h2");

    $.ajax({
      url:    $.ink.Routes.admin.login, 
      data:   { u: username, p: password }, 
      type:   'POST',
      success: function(data){
        $heading.text("Nice, you're in!");
        $.ink.views.App.delayedReload();
      },
      error: function(data){
        $heading.text("Unauthorized");
      }
    });
  },

  showGenerateKey : function(){
    new $.ink.views.GenerateKey().render();
  },

  handleEnter: function(ev){
    if (ev.which && ev.which == 13) 
      this.login();
  }

});