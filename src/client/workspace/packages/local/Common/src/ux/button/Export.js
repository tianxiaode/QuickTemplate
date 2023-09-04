Ext.define('Common.ux.button.Export',{
    extend: 'Ext.Button',
    xtype: 'uxexportbutton',


    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Export',
            iconCls: 'x-fa fa-file-export',
        },
        'phone && !cancel':{
            ui: 'plain',
            iconCls: 'md-icon-publish',
        }
    }

})