Ext.define('Common.overrides.shared.Button',{
    override: 'Ext.Button',

    config:{
        langText: null,
        langTooltip: null,
    },

    onLocalized(){
        const me = this,
            resourceName = me.getResourceName(),
            langText = me.getLangText(),
            tooltip = me.getLangTooltip();
        let text = me.getText();

        if(text && !langText){
            me.setLangText(text);
        }
        text = me.getLangText();
        if(text){
            me.setText(I18N.get(text, resourceName));
        }
        if(tooltip){
            me.setTooltip(I18N.get(tooltip, resourceName));
        }
    }

})