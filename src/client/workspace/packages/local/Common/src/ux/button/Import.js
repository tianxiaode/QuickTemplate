Ext.define('Common.ux.button.Import',{
    extend: 'Ext.Button',
    xtype: 'uximportbutton',

    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Import',
            ui: 'success',
            weight: 70,
            iconCls: 'x-fa fa-file-import',
        },
        'phone && !cancel':{
            ui: 'plain',
            weight: 50,
            iconCls: 'md-icon-system-update-alt',
        }
    },

})