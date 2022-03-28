Ext.define('Desktop.view.identity.roles.RoleController', {
    extend: 'Common.ux.crud.controller.Base',
    alias: 'controller.desktop-rolecontroller',

    mixins:[
        'Common.view.identity.roles.mixins.Controller'
    ]
});