

var InkAdminSync = Backbone.View.extend({
  events: {
    'click .sync'   : 'sync',
    'click .pull'   : 'pull',
    'click .status' : 'status',
    'click .close'  : 'remove'
  },

  render: function() {
    $.ink.views.App.closeDialog();

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.sync');
    this.$el.html(t);
    $('body').append(this.$el);

    this.getElements();

    return this;
  },

  sync: function(){
    var self = this;
    this.wait();
    
    $.ajax({
      url:    $.ink.Routes.sync.save,
      type:  'POST',
      success:  function(data){
        self.done();
        new $.ink.admin.views.Output({ content: data.output }).render()
      }
    });
  },

  pull: function(){
    var self = this;
    this.wait();
    
    $.ajax({
      url:    $.ink.Routes.sync.pull,
      type:  'POST',
      success:  function(data){
        self.done();
        new $.ink.admin.views.Output({ content: data.output }).render()
      }
    });
  },

  status : function(){
    var self = this;
    this.wait();

    $.ajax({
      url:  $.ink.Routes.sync.status,
      success:  function(data){
        self.done();
        new $.ink.admin.views.Output({ content: data.output }).render()
      }
    });

  },

  getElements: function(){
    this.$heading = this.$el.find('h2');
    this.origText = this.$heading.text()
  },

  wait: function(){
    this.$heading.text('Please wait...');
  },

  done: function(){
    this.$heading.text( this.origText );
  }

});