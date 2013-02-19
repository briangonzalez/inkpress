

var InkAdminUnpublishedDialog = Backbone.View.extend({
  events: function(){
    var events = {};
    events[ $.ink.startEvent + " " + '.close']           = 'remove';
    return events;
  }, 

  render: function() {
    $.ink.views.App.closeDialog();

    var unpublished = [];
    $.ajax({
      url: $.ink.Routes.admin.unpublished,
      async: false,
      type:   'POST',
      success: function(data){
        unpublished = data.posts;
      }
    })

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.unpublished', { posts : unpublished });
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  }

});