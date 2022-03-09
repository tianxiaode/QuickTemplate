Ext.define('Common.shared.ux.button.Swap',{
    extend: 'Ext.Button',
    xtype: 'uxswapbutton',

    responsiveConfig:{
        desktop:{
        },
        phone:{
            iconCls: 'md-icon-swap-horiz',
            ui: 'plain',
            weight : 40,
        }
    },

    handler: 'onSwitchView', 

})