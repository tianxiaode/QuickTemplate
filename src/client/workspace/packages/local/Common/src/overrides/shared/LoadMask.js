Ext.define('Common.overrides.shared.LoadMask',{
    override: 'Ext.LoadMask',

    config:{
        langMessage: null
    },

    onLocalized(){
        let me = this,
            resourceName = me.resourceName || me.getContainerResourceName(),
            langMessage = me.getLangMessage();
        if(!langMessage){
            me.setLangMessage(me.getMessage());
        }
        let message = me.getLangMessage();
        if(message) me.setMessage(I18N.get(message, resourceName));
    }

})