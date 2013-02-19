

var InkAdminActionsDialog = Backbone.View.extend({
  events : function(){
    var events = {};

    events[ 'click' + ' .new' ]           = 'showNew',
    events[ 'click' + ' .edit-page' ]     = 'editPage',
    events[ 'click' + ' .delete-page' ]   = 'deletePage',
    events[ 'click' + ' .unpublished' ]   = 'showUnpublished',
    events[ 'click' + ' .sync' ]          = 'showSync',
    events[ 'click' + ' .add-user' ]      = 'showAddUser',
    events[ 'click' + ' .app-settings' ]  = 'appSettings',
    events[ 'click' + ' .short-url' ]     = 'showShortURL',
    events[ 'click' + ' .upload' ]        = 'showUploadFile',
    events[ 'click' + ' .generate-key' ]  = 'showGenerateKey',
    events[ 'click' + ' .logout' ]        = 'showLogout',
    events[ $.ink.startEvent + " " + '.close'] = 'remove'

    return events;
  }, 

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.actions');
    this.$el.html(t);
    $('body').append(this.$el);
    return this;
  },

  showNew: function(){
    new $.ink.admin.views.NewPageOrPost().render();
  },

  editPage: function(){
    window.location = $.ink.admin.edit.path + '?edit';
  },

  deletePage: function(ev){
    ev && ev.preventDefault();

    var shouldDelete = confirm("Are you sure you want to delete the content at: \n" + $.ink.admin.edit.path)

    if ( shouldDelete ) {
      $.ajax({
        url:  $.ink.Routes.admin.deletePage,
        type:   'POST',
        data: { path:       $.ink.admin.edit.path },
        success:  function(data){
          window.location = '/';
        },
        error: function(data){
          alert('Error deleting page.')
        }
      });
    }
  },  

  showUnpublished: function(){
    new $.ink.admin.views.Unpublished().render()
  },

  showSync: function(){
    new $.ink.admin.views.Sync().render();
  },

  showAddUser: function(){
    new $.ink.admin.views.AddUser().render();
  },

  appSettings: function(){
    window.location = $.ink.Routes.admin.settings
  },

  showShortURL: function(){
    new $.ink.admin.views.ShortURL().render();
  },


  showUploadFile: function(){
    new $.ink.admin.views.UploadFile().render();
  },

  showGenerateKey: function(){
    new $.ink.views.GenerateKey().render();
  },

  showLogout: function(){
    new $.ink.admin.views.Logout().render();
  }

});