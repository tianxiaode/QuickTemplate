Ext.define('Common.ux.button.History',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxhistorybutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'History';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return 'x-fa fa-history';
        return 'md-icon-history';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'header';
        return null;
    },

    arrow: false,
    disabled: true

});
