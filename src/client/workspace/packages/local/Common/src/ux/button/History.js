Ext.define('Common.ux.button.History',{
    extend: 'Ext.Button',
    xtype: 'uxhistorybutton',

    responsiveConfig:{
        'desktop && !cancel':{
            ui: 'header',
            iconCls: 'x-fa fa-history',
            langTooltip: 'History'
        },
        'phone && !cancel':{
            iconCls: 'md-icon-history',
        }
    },

    arrow: false,
    disabled: true

});
