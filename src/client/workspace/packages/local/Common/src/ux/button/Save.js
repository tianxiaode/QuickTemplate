Ext.define('Common.ux.button.Save',{
    extend: 'Ext.Button',
    xtype: 'uxsavebutton',

    responsiveConfig:{
        'desktop && !cancel':{
            weight: 80,
            ui: 'action',
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 300,
            iconCls: 'md-icon-done',
        }
    },


})