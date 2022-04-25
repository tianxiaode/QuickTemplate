Ext.define('Common.ux.button.Save',{
    extend: 'Ext.Button',
    xtype: 'uxsavebutton',

    responsiveConfig:{
        'desktop && !cancel':{
            weight: 80,
            ui: 'action',
            langText: 'Save',
            userCls: 'lh-24',
            margin: '0 5px 0 0'
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 300,
            iconCls: 'md-icon-done',
        }
    },


})