Ext.define('Common.shared.ux.button.History',{
    extend: 'Ext.Button',
    xtype: 'uxhistorybutton',

    responsiveConfig:{
        desktop:{
            ui: 'header',
            iconCls: 'x-fa fa-history',
            langTooltip: 'History'
        },
        phone:{
            //ui: 'plain phone-badge',
            iconCls: 'md-icon-history',
        }
    },

    arrow: false,
    disabled: true

});
