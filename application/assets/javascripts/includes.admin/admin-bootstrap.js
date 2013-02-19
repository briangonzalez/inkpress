

 
$(document).ready(function(){

  // Namespace that ish..
  $.ink.admin = {}
  $.ink.admin.views                     = {};
  $.ink.admin.views.App                 = new InkAdminApp();
  $.ink.admin.views.Edit                = new InkAdminEdit();
  $.ink.admin.views.EditSettings        = new InkAdminEditSettings();
  $.ink.admin.views.EditFiles           = InkAdminEditFilesDialog;
  $.ink.admin.views.Logout              = InkAdminLogoutDialog;
  $.ink.admin.views.NewPageOrPost       = InkAdminNewPageOrPost;
  $.ink.admin.views.NewAssociatedFile   = InkAdminNewAssociatedFile;
  $.ink.admin.views.Actions             = InkAdminActionsDialog;
  $.ink.admin.views.Sync                = InkAdminSync;
  $.ink.admin.views.Output              = InkAdminOutput;
  $.ink.admin.views.AddUser             = InkAdminAddUserDialog;
  $.ink.admin.views.ShortURL            = InkAdminShortURLDialog;
  $.ink.admin.views.UploadFile          = InkAdminUploadFileDialog;
  $.ink.admin.views.Unpublished         = InkAdminUnpublishedDialog;
  
});