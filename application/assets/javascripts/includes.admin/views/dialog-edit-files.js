

var InkAdminEditFilesDialog = Backbone.View.extend({

  events: {
    'click .close'          : 'remove',
    'click .file'           : 'loadFile',
    'click .new'            : 'showNew'
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var response = {};
    $.ajax({
      url:        $.ink.Routes.admin.files,
      type:       'POST',
      async:      false,
      data:       { path: $.ink.admin.edit.path },
      success:    function(data){
        response = data;
      } 
    });

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.edit-files', response);
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  },

  loadFile: function(ev, obj){
    var $target = $(ev.target);

    var file = $target.attr('data-file');
    var main = $target.attr('data-main') == 'true' ? true : false;

    $.ajax({
      url:        $.ink.Routes.admin.fileContent,
      type:       'POST',
      data:       { file: file },
      success:    function(data){
        $.ink.admin.views.Edit.startEditingFile( data.content, file, main );
      } 
    });
  },

  showNew: function(){
    new $.ink.admin.views.NewAssociatedFile().render();
  }

});