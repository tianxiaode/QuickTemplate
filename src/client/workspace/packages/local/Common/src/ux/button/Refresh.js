Ext.define('Common.ux.button.Refresh',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxrefreshbutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Refresh';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return 'x-fa fa-undo';
        return 'md-icon-refresh';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'cyan';
        return 'plain';
    }

})