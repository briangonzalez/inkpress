

var InkAdminAddUserDialog = Backbone.View.extend({
  events: {
    'click .add'    : 'addUser',
    'click .close'  : 'remove',
    'click .generate-key'   : 'showGenerateKey'
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.add-user');
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  },

  addUser: function(){
    var self      = this;
    var $heading  = this.$el.find("h2");
    var username  = this.$el.find(".username").val();
    var key       = this.$el.find(".key").val();
    $heading.text('Adding user....');

    $.ajax({
      url:  $.ink.Routes.admin.addUser,
      type:   'POST',
      data: { u: username, k: key },
      success:  function(data){
        $heading.text(data.msg);
        self.$el.find('input').val('');
      }
    });
  },

  showGenerateKey : function(){
    new $.ink.admin.views.GenerateKey().render();
  }

});