Ext.define('Common.ux.button.Save',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxsavebutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Save';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return null;
        return 'md-icon-done';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'action';
        return 'plain';
    },

    responsiveConfig:{
        'desktop && !cancel':{
            langText: 'Save',
            userCls: 'lh-24',
            margin: '0 5px 0 0'
        }
    }


})