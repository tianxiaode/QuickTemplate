Ext.define('Common.overrides.menu.Item',{
    override: 'Ext.menu.Item',

    config:{
        langText: null
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

    }

})