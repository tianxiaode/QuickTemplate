Ext.define('Common.ux.button.SaveAndNew',{
    extend: 'Ext.Button',
    xtype: 'uxsaveandnewbutton',

    responsiveConfig:{
        'desktop && !cancel':{
            weight: 70,
            ui: 'action',
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 250,
            iconCls: 'md-icon-add',
        }
    },

})