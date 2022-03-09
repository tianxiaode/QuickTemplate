Ext.define('Common.overrides.shared.menu.Item',{
    override: 'Ext.menu.Item',

    config:{
        langText: null
    },

    onLocalized(){
        let me = this,
            resourceName = me.resourceName || me.getContainerResourceName(),
            langText = me.getLangText();
        let text = me.getText();
        if(text && !langText){
            me.setLangText(text);
        }
        text = me.getLangText();
        if(text) me.setText(I18N.get(text, resourceName));
    }

})