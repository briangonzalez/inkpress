// App View
// ----------
var InkCodeView = Backbone.View.extend({

  // Body is our element.
  el: $('pre code[lang]'),

  // The DOM events specific to an item.
  events: function(){
    var events = {};
    return events;
  },

  initialize: function(){
    this.$ruby          = this.$el.filter("[lang='ruby']");
    this.$python        = this.$el.filter("[lang='python']");
    this.$javascript    = this.$el.filter("[lang='javascript']");
    this.$html          = this.$el.filter("[lang='html']");
    this.$css           = this.$el.filter("[lang='css']");
    this.$scss           = this.$el.filter("[lang='scss']");
    this.$shell         = this.$el.filter("[lang='shell']");

    this.highlightCode();
    this.nameCode();
    this.addFullScreenButtons();
    this.bindFullScreenButtons();
  },

  highlightCode: function(){
    // Highlight the code
    this.$ruby.attr('data-language', 'ruby');             
    this.$python.attr('data-language', 'python');         
    this.$javascript.attr('data-language', 'javascript');  
    this.$html.attr('data-language', 'html');  
    this.$css.attr('data-language', 'css');  
    this.$scss.attr('data-language', 'css');  
    this.$shell.attr('data-language', 'shell');  

  },

  nameCode: function(){
    $.each( this.$el, function(idx, el){
      var $el   = $(el);
      var $pre  = $el.parents('pre');
      var lang  = $el.attr('lang');

      var $lang = $("<div/>", { class: 'language', text: lang })
      $pre.append($lang)

    });
  },

  addFullScreenButtons: function(){
    $.each( this.$el, function(idx, el){
      var $el   = $(el);
      var $pre  = $el.parents('pre');

      var $full = $("<i/>", { class: 'fullscreen icon-resize-full' })
      $pre.append($full)
    });
  },

  bindFullScreenButtons: function(){
    $('pre code[lang]').parent().find('i.fullscreen').click(function(){
      $(this).parent().toggleClass('expanded')
    })
  }

});