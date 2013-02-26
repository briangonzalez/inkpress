var InkAdminUploadFileDialog = Backbone.View.extend({
  events: {
    'dragover .drag-area'   : 'over',
    'dragleave .drag-area'  : 'leave',
    'drop .drag-area'       : 'drop',
    'change .file'          : 'handleFileAdd',
    'click .close'          : 'remove'
  },

  getElements: function(){
    this.$dragarea  = this.$el.find('.drag-area');
    this.$content   = this.$el.find('.content');
    this.$close     = this.$el.find('.close');
    $('body').on('drop',     function(ev){ ev.preventDefault() });
    $('body').on('dragover', function(ev){ ev.preventDefault() });
  },

  render: function() {
    $.ink.views.App.closeDialog();
    $.event.props.push('dataTransfer');

    var t = $.ink.TemplateFetcher.getTemplate('admin.dialog.upload-file', {});
    this.$el.html(t);
    $('body').append(this.$el);
    this.getElements();
    return this;
  },

  over: function(ev){
    ev.preventDefault()
    this.$dragarea.addClass('dragover');
  },

  leave: function(ev){
    ev.preventDefault()
    this.$dragarea.removeClass('dragover');
  },

  drop: function(ev){
    ev.preventDefault();
    this.$dragarea.removeClass('dragover');


    var formData = new FormData();

    _.each( ev.dataTransfer.files, function(file, idx){
      formData.append('files[]', file )
    });

    this.sendFiles( formData );
  },

  sendFiles: function(formData){
    var self = this;
    // now post a new XHR request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', $.ink.Routes.admin.upload + "?" + new Date().getTime(), true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        self.uploadSuccess( JSON.parse(xhr.response).file_URLs );
      } else {
        self.uploadError();
      }
    };
    xhr.send(formData);
  },

  handleFileAdd: function(ev){
    var formData = new FormData();
    _.each( ev.target.files, function(file, idx){
      formData.append('files[]', file )
    });
    this.sendFiles( formData );
  },

  uploadSuccess: function(files){

    var self = this;
    var $fileURL = this.$el.find('.file-url').first();

    _.each(files, function(file){
      $fileURL.clone().text( window.location.origin + '/' + file).insertBefore(self.$close).show();
    })
  } 

});