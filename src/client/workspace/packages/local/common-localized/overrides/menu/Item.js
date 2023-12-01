Ext.define('Common.overrides.menu.Item',{
    override: 'Ext.menu.Item',

    config:{
        langText: null
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

    }

})