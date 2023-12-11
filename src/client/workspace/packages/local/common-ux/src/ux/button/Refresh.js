Ext.define('Common.ux.button.Refresh',{
    extend: 'Ext.Button',
    xtype: 'uxrefreshbutton',

    langTooltip: 'Refresh',
    iconCls: 'x-fa fa-redo',

    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Refresh',
            weight: 200
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 80
        }
    }

})