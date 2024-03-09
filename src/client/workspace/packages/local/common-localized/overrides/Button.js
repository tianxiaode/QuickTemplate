Ext.define('Common.overrides.Button',{
    override: 'Ext.Button',

    config:{
        langText: null,
        langTooltip: null,
    },

    updateLangTooltip(){
        this.onLocalized();
    },

    onLocalized(){
        let me = this,
            langText = me.getLangText(),
            text = me.getText();
            
        if(text && !langText){
            me.setLangText(text);
        }

        text = me.getLocalizedText(me.getLangText());
        
        text && me.setText(text);

        text = me.getLocalizedText(me.getLangTooltip());
        
        text && me.setTooltip(text);
    }

})