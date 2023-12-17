Ext.define('Common.ux.button.Refresh',{
    extend: 'Ext.Button',
    xtype: 'uxrefreshbutton',

    langTooltip: 'Refresh',
    iconCls: 'x-fa fa-redo',

    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Refresh',
            weight: 400
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 80
        }
    }

})