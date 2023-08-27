Ext.define('Common.ux.button.Create',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxcreatebutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Add';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return 'x-fa fa-file';
        return 'md-icon-add';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'success';
        return 'plain';
    }


    
})