
// Admin View
// ----------
var InkAdminApp = Backbone.View.extend({

  // Body is our element.
  el: $('body'),

  // The DOM events specific to an item.
  events: function(){
    var events = {};

    events[ $.ink.startEvent + ' footer .user a' ] = 'showActions';
    events[ $.ink.startEvent + ' .no-posts .new-page-or-post'] = 'showNew';

    return events;
  }, 

  showActions: function(ev){
    ev && ev.preventDefault();
    new $.ink.admin.views.Actions().render();
  },

  showNew: function(ev){
    ev && ev.preventDefault();
    new $.ink.admin.views.NewPageOrPost().render();
  }
  
});