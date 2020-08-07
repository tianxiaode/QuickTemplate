Ext.define('Common.overrides.shared.menu.Item',{
    override: 'Ext.menu.Item',

    config:{
        langText: null
    },

    onLocalized(){
        const me = this,
            resourceName = me.getResourceName(),
            langText = me.getLangText();
        let text = me.getText();
        if(text && !langText){
            me.setLangText(text);
        }
        text = me.getLangText();
        if(text) me.setText(I18N.get(text, resourceName));
    }

})