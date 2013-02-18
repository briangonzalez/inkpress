

var InkAdminLogoutDialog = Backbone.View.extend({
  events: {
    'click .close'  : 'remove',
    'click .logout' : 'logout'
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.logout');
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  },

  logout: function(){
    var self      = this;
    var $heading  = this.$el.find("h2");
    $heading.text('Logging out...');

    $.ajax({
      url:  $.ink.Routes.admin.logout,
      type:   'POST',
      success:  function(data){
        $heading.text('Logged out! Reloading page...');
        $.ink.views.App.delayedReload();
      }
    })
  }

});