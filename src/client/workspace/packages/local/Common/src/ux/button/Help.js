Ext.define('Common.ux.button.Help',{
    extend: 'Common.ux.button.Auto',
    xtype: 'uxhelpbutton',

    applyLangTooltip(tip){
        if(tip !== 'auto') return tip;
        if(Ext.platformTags.desktop) return 'Help';
        return null;
    },

    applyIconCls(cls){
        if(cls !== 'auto') return cls;
        return 'x-far fa-question-circle';
    },

    applyUi(ui){
        if(ui !== 'auto') return ui;
        if(Ext.platformTags.desktop) return 'success';
        return null;
    },

    arrow: false,

    config:{
        helpText: null,
    },

    updateHelpText(text){
        let me = this;
        if(Ext.isArray(text)){
            text = me.getArrayText(text, true);
        }else{
            text = me.getLocalizedText(text);
            if(Ext.isArray(text)) text =me.getArrayText(text, false);
        }
        me.setMenu({
            items:[
                {
                    xtype: 'component',
                    flex: 1,
                    html: text
                }
            ]
        });
    },

    getArrayText(text, needLocalized){
        let html = [];
        text.forEach(t=>{
            html.push(needLocalized ? me.getLocalizedText(t) : t);
        })
        return html.join('');
    },

    getLocalizedText(text){
        return I18N.get(text , this.getResourceName());
    }


})