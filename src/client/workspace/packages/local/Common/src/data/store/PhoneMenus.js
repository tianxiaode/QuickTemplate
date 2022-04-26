Ext.define('Common.data.store.PhoneMenus',{
    extend: 'Common.ux.data.Store',
    alias: 'store.phonemenus',

    requires:[
        'Common.data.model.PhoneMenu'
    ],

    model: 'Common.data.model.PhoneMenu',
    controller: ['configuration','menus', 'phone'],
    pageSize: 0,

})