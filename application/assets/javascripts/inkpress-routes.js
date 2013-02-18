
$.ink         = $.ink || {};
$.ink.Routes  = {

  admin: {
    login:                  '/ink/admin/login',
    logout:                 '/ink/admin/logout',
    generateKey:            '/ink/admin/generate-key',
    addUser:                '/ink/admin/add-user',
    settings:               '/ink/admin/settings',
    savePage:               '/ink/admin/save-page',
    deletePage:             '/ink/admin/delete-page',
    recompile:              '/ink/admin/recompile',
    createPageOrPost:       '/ink/admin/create-page-or-post',
    createAssociatedFile:   '/ink/admin/create-associated-file',
    files:                  '/ink/admin/files',
    fileContent:            '/ink/admin/file-content',
    upload:                 '/ink/admin/upload'
  },

  sync: {
    status:                 '/ink/sync/status',
    save:                   '/ink/sync/save'
  },

  short: '/ink/short'

} 