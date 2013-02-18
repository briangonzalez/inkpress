

var InkAdminOutput = Backbone.View.extend({
  events: {
    'click .close'  : 'remove'
  },

  initialize: function(options){
    this.content = options.content;
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.output', { output: this.content });
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  }

});