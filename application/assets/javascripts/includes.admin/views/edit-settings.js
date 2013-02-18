

// Admin Edit View
// ----------------
var InkAdminEditSettings = Backbone.View.extend({

  // Body is our element.
  el: $('.admin-edit-page'),

  // The DOM events specific to an item.
  events: {
    "click .controls .recompile"  : "recompile"
  },

  initialize: function(){
    this.$recompile           = this.$el.find('a.control.recompile');  
  },

  recompile: function(ev){
    ev.preventDefault();
    var self = this;
    $.ajax({
      url:  $.ink.Routes.admin.recompile,
      type:   'POST',
      success:  function(data){
        self.highlightRecompile();
      }
    });
  },

  highlightRecompile: function(){
    var $i = this.$recompile.find('i'); 
    var oldClass = $i.attr('class');
    $i.removeClass(oldClass);
    $i.addClass('icon-ok')

    setTimeout(function(){
      $i.removeClass('icon-ok');
      $i.addClass( oldClass );
    }, 1000)
  }

});