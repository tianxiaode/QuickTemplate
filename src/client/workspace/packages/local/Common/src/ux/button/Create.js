Ext.define('Common.ux.button.Create',{
    extend: 'Ext.Button',
    xtype: 'uxcreatebutton',

    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Add',
            ui: 'success',
            weight: 70,
            iconCls: 'x-fa fa-file',
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 50,
            iconCls: 'md-icon-add',
        }
    },


})