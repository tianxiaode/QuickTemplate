Ext.define('Common.ux.button.Trash',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxtrashbutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Delete';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        if(Ext.platformTags.desktop) return 'x-fa fa-trash';
        return 'md-icon-delete';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'danger';
        return 'plain';
    }

})