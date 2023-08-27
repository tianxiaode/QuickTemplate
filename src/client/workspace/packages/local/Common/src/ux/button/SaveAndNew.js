Ext.define('Common.ux.button.SaveAndNew',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxsaveandnewbutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'SaveAndNew';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return null;
        return 'md-icon-add';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'action';
        return 'plain';
    },


    responsiveConfig:{
        'desktop && !cancel':{
            langText: 'SaveAndNew',
            userCls: 'lh-24',
            margin: '0 5px 0 0'
        }
    }

})