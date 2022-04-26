Ext.define('Common.ux.field.Enumeration',{
    extend: 'Ext.field.Select',
    xtype: 'uxenumerationfield',

    mixins:[
        'Common.mixin.Enumeration'
    ],

    picker: 'floated',

    config:{
        store:{
            sorters: 'order'
        },    
    }

})
