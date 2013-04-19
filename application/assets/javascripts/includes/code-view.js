// App View
// ----------
var InkCodeView = Backbone.View.extend({

  // Body is our element.
  el: $('pre code'),

  // The DOM events specific to an item.
  events: function(){
    var events = {};
    return events;
  },

  initialize: function(){
    hljs.initHighlightingOnLoad();
    this.addFullScreenButtons();
  },

  addFullScreenButtons: function(){
    $.each( this.$el, function(idx, el){
      var $el   = $(el);
      var $pre  = $el.parents('pre');

      var $full = $("<i/>", { class: 'fullscreen icon-resize-full' })
      $pre.append($full)
    });

    this.bindFullScreenButtons();
  },

  bindFullScreenButtons: function(){
    $('pre code').parent().find('i.fullscreen').click(function(){
      $(this).parent().toggleClass('expanded');
    })
  }

});