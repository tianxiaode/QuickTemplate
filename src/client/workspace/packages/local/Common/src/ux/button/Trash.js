Ext.define('Common.ux.button.Trash',{
    extend: 'Ext.Button',
    xtype: 'uxtrashbutton',


    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Delete',
            weight: 90,
            ui: 'danger',
            iconCls: 'x-fa fa-trash',
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 70,
            iconCls: 'md-icon-delete',
        }
    }


})