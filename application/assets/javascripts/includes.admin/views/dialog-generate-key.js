

var InkAdminGenerateKeyDialog = Backbone.View.extend({
  events: {
    'click .close'      : 'remove',
    'click .generate'   : 'generateKey'
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.generate-key');
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  },

  generateKey: function(ev){
    var username  = this.$el.find(".username").val();
    var password  = this.$el.find(".password").val();
    var $key      = this.$el.find(".key");
    var $heading  = this.$el.find("h2");

    $.post($.ink.Routes.admin.generateKey, { u: username, p: password }, function(data){
      $heading.text('Paste key into site configuration!')
      $key.val( data.key );
    });
  }

});