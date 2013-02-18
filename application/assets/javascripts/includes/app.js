

$(document).ready(function(){

  // Get our start event
  $.ink.startEvent = Modernizr.touch ? 'touchstart' : 'click';

  // Namespace that ish..
  $.ink = $.ink || {}
  $.ink.views               = {};
  $.ink.views.App           = new InkApp();
  $.ink.views.CodeView      = new InkCodeView();
  $.ink.views.GenerateKey   = InkAdminGenerateKeyDialog;
  $.ink.views.Login         = InkAdminLoginDialog;
  $.ink.TemplateFetcher     = new TemplateFetcher();

});



