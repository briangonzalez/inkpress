(function(){

  $(document).ready(function(){

    // Get our breakpoints with the help of a little magic.
    var $el = $('</p>').addClass('media-query-breakpoints');
    $('body').append($el);
    $.ink.breakpoints   = $el.css('content').replace("'", '').split(',');
    $.ink.breakpoints   = _.map( $.ink.breakpoints, function(b){ return parseInt(b) });
    $.ink.navBreakpoint = parseInt( $el.css('width') ); 
    $el.hide()

    // Grab our variables.
    var $nav      = $('nav.main');

    // Window Resive Event with show/hide logic
    $(window).resize(function(){
      
      $.ink.windowResizer = setTimeout(function(){
   
        if ( $(window).innerWidth() >= $.ink.navBreakpoint && !$nav.is(':visible') ){
          $nav.show();
        } else if ( $(window).innerWidth() < $.ink.navBreakpoint ){
          $nav.hide();
        }

      })

    });

  });

})(jQuery)