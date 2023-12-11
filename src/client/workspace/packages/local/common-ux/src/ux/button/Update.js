Ext.define('Common.ux.button.Update',{
    extend: 'Ext.Button',
    xtype: 'uxupdatebutton',

    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Edit',
            weight: 80,
            iconCls: 'x-fa fa-edit'
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 60,
            iconCls: 'md-icon-edit'
        }
    }


})