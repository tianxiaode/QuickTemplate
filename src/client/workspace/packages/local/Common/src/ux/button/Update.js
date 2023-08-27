Ext.define('Common.ux.button.Update',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxupdatebutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Edit';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return 'x-fa fa-edit';
        return 'md-icon-edit';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return null;
        return 'plain';
    }

})