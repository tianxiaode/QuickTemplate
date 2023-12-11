Ext.define('Common.ux.button.Help',{
    extend: 'Ext.Button',
    xtype: 'uxhelpbutton',

    responsiveConfig:{
        'desktop && !cancel':{
            langTooltip: 'Help',
            ui: 'success',
            weight: 70,
            iconCls: 'x-far fa-question-circle'
        }
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