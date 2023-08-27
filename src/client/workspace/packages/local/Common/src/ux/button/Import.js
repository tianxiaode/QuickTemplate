Ext.define('Common.ux.button.Import',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uximportbutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Import';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return 'x-fa fa-file-import';
        return 'md-icon-system-update-alt';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'success';
        return 'plain';
    }



})