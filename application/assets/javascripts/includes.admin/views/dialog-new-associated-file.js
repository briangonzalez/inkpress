var InkAdminNewAssociatedFile = Backbone.View.extend({

  events: {
    'click .create'   : 'create',
    'click .close'    : 'remove'
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.new-associated-file');
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  },

  create: function(ev){
    var $heading  = this.$el.find('h2');
    var name      = this.$el.find('.name').val();

    $.ajax({
      url:    $.ink.Routes.admin.createAssociatedFile, 
      data:   { name: name, path: $.ink.admin.edit.path, burst: new Date().getTime() }, 
      type:   'POST',
      success: function(data){
        $heading.text( data.msg );
        $.ink.admin.views.Edit.startEditingFile('', data.path)
      },
      error: function(data){
        $heading.text("Already exists / unauthorized");
      }
    });
  
  }

});