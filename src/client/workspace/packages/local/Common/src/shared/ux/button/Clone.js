Ext.define('Common.shared.ux.button.Clone',{
    extend: 'Ext.Button',
    xtype: 'uxclonebutton',

    responsiveConfig:{
        desktop:{
            iconCls: 'x-fa fa-clone',
            langTooltip: 'ImportUser',
            ui: 'action', 
            weight: 290,
        },
        phone:{
            iconCls: 'md-icon-filter-none',
            ui: 'plain',
            weight : 50,
        }
    },

    handler: 'onImportUser', 

})