Ext.define('Common.ux.button.Export',{
    extend: 'Ext.Button',
    xtype: 'uxexportbutton',


    langTooltip: 'Export',

    ui: 'defaults',
    iconCls: 'x-fa fa-file-export',
    
    applyUi(ui){
        return Ext.platformTags.phone 
            ? 'plain'
            : ui;        
    },

    applyIconCls(cls){
        return Ext.platformTags.phone 
            ? 'md-icon-publish'
            : cls;        
    }

})