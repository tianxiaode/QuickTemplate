Ext.define('Common.ux.button.Reset',{
    extend: 'Ext.Button',
    xtype: 'uxresetbutton',

    responsiveConfig:{
        'desktop && !cancel':{
            weight: 90,
            ui: 'soft-purple', 
            langText: 'Reset',
            userCls: 'lh-24',
            margin: '0 5px 0 0'
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 60,
            iconCls: 'md-icon-undo',
        }
    },

})