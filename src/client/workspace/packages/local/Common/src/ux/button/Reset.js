Ext.define('Common.ux.button.Reset',{
    extend: 'Ext.Button',
    xtype: 'uxresetbutton',

    responsiveConfig:{
        'desktop && !cancel':{
            weight: 90,
            ui: 'soft-purple', 
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 60,
            iconCls: 'md-icon-undo',
        }
    },

})