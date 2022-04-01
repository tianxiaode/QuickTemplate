Ext.define('Common.ux.crud.Panel',{
    extend: 'Ext.Panel',
    xtype: 'uxcrudpanel',

    mixins:[
        'Common.mixin.component.Back',
        'Common.mixin.component.Crud',
        'Common.mixin.component.Search',
        'Common.mixin.component.SearchField',
    ],

    ui: 'dark',
    title: '\xA0',
    
})