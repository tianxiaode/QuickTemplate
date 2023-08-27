Ext.define('Common.ux.button.Reset',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxresetbutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Reset';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return null;
        return 'md-icon-undo';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'soft-purple';
        return 'plain';
    },



    responsiveConfig:{
        'desktop && !cancel':{
            langText: 'Reset',
            userCls: 'lh-24',
            margin: '0 5px 0 0'
        }
    }

})