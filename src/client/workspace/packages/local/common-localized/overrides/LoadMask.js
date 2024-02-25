Ext.define('Common.overrides.LoadMask',{
    override: 'Ext.LoadMask',

    config:{
        langMessage: null
    },

    onLocalized(){
        let me = this,
            resourceName = me.getResourceName(),
            message = me.getMessage(),
            langMessage = me.getLangMessage();
        
        if(message && !langMessage){
            me.setLangMessage(message);
        }
    
        message = me.getLocalizedText(me.getLangMessage(), resourceName);
        
        message && me.setMessage(message);

    }

})