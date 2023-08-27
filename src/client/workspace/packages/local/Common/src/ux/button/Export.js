Ext.define('Common.ux.button.Export',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxexportbutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Export';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return 'x-fa fa-file-export';
        return 'md-icon-add';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return null;
        return 'plain';
    }


})