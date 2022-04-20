Ext.define('Common.ux.button.Refresh',{
    extend: 'Ext.Button',
    xtype: 'uxrefreshbutton',

    langTooltip: 'Refresh',

    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Refresh',
            weight: 200,
            ui: 'cyan', 
            iconCls: 'x-fa fa-undo',
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 80,
            iconCls: 'md-icon-refresh',
        }
    },

})