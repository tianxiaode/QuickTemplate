Ext.define('Common.overrides.Button',{
    override: 'Ext.Button',

    config:{
        langText: null,
        langTooltip: null,
    },


    onLocalized(){
        let me = this,
            resourceName = me.getResourceName(),
            langText = me.getLangText(),
            text = me.getText();
            
        if(text && !langText){
            me.setLangText(text);
        }

        text = me.getLocalizedText(me.getLangText(), resourceName);
        
        text && me.setText(text);

        text = me.getLocalizedText(me.getLangTooltip(), resourceName);
        
        text && me.setTooltip(text);
    },

})