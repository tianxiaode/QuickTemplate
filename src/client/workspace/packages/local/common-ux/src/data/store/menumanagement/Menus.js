Ext.define('Common.data.store.menumanagement.Menus',{
    extend: 'Common.core.data.Store',
    alias: 'store.menus',

    requires:[
        'Common.data.model.menumanagement.Menu'
    ],

    model: 'Common.data.model.menumanagement.Menu',
    autoLoad: false,
    pageSize: 25
})