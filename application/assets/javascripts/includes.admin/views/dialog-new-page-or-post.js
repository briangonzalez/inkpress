var InkAdminNewPageOrPost = Backbone.View.extend({
  events: {
    'click .page, .post'    : 'create',
    'keyup .name'           : 'makeURLs',
    'click .close'          : 'remove'
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.new-page-or-post');
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  },

  create: function(ev){
    var $heading  = this.$el.find('h2');
    var name      = this.$el.find('.name').val();
    var type      = $(ev.target).hasClass('page') ? 'page' : 'post';

    $.ajax({
      url:    $.ink.Routes.admin.createPageOrPost, 
      data:   { name: name, type: type, burst: new Date().getTime() }, 
      type:   'POST',
      success: function(data){
        $heading.text("Created!");
        window.location = data.url + "?edit"
      },
      error: function(data){
        $heading.text("Already exists / unauthorized");
      }
    });
  
  },

  makeURLs: function(){
    var pagePath = this.$el.find('.page-path');
    var postPath = this.$el.find('.post-path');
    var name     = this.$el.find('.name').val();

    pagePath.val(window.location.origin + '/' + name );
    postPath.val(window.location.origin + '/posts/' + name )
  }

});