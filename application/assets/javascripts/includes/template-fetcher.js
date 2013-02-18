
function TemplateFetcher(){
  
  this.init = function(){
    this.baseUrl    = '/templates';
    this.templates  = {}
  }

  this.getTemplate = function(name, data){
    var self      = this;
    var template  = null
    data          = data || {}

    if (this.templates[name]){
      template = _.template( this.templates[name], data );
    } else {
      $.ajax({
        url:      this.baseUrl + '/' + name + '.jst' ,
        async:    false,
        success:  function(response){
          self.templates[name] = response;
          template = _.template(response, data);
        }
      });
    }

    return template;
  }

  this.init();
}