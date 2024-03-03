Ext.define('Common.overrides.LoadMask',{
    override: 'Ext.LoadMask',

    config:{
        langMessage: null
    },

    onLocalized(){
        let me = this,
            message = me.getMessage(),
            langMessage = me.getLangMessage();
        
        if(message && !langMessage){
            me.setLangMessage(message);
        }
    
        message = me.getLocalizedText(me.getLangMessage());
        
        message && me.setMessage(message);

    }

})