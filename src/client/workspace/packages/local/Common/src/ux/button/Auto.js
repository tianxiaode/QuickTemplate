Ext.define('Common.ux.button.Auto',{
    extend: 'Ext.Button',

    langTooltip: 'auto',
    iconCls: 'auto',
    ui: 'auto',


    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        return null;
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        return null;
    }

    
})