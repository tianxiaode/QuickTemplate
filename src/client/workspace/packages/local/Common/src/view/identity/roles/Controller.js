Ext.define('Common.view.identity.roles.Controller',{
    extend: 'Common.ux.crud.controller.Base',
    alias: 'controller.rolecontroller',

    requires:[
        'Common.view.identity.roles.Edit',
        'Common.view.identity.roles.Multilingual',
        'Common.view.identity.roles.Menu',
    ],



})