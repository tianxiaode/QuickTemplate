Ext.define('Common.ux.button.SaveAndNew',{
    extend: 'Ext.Button',
    xtype: 'uxsaveandnewbutton',

    responsiveConfig:{
        'desktop && !cancel':{
            weight: 70,
            ui: 'action',
            langText: 'SaveAndNew',
            userCls: 'lh-24',
            margin: '0 5px 0 0'
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 250,
            iconCls: 'md-icon-add'
        }
    }

})