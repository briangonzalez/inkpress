

var InkAdminShortURLDialog = Backbone.View.extend({
  events: {
    'click .generate' : 'generateShortURL',
    'click .close'    : 'remove'
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.short-url');
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  },

  generateShortURL: function(){
    var url       = this.$el.find(".url").val();
    var $shortURL = this.$el.find(".short-url");

    $.post( $.ink.Routes.short, { url: url }, function(data){
      $shortURL.val( data.short_url );
    });
  }

});