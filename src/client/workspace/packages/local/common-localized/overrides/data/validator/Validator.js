Ext.define('Common.overrides.data.validator.Validator',{
    override: 'Ext.data.validator.Validator',

    config:{
        langMessage: null
    },

    constructor: function(config) {
        let me = this;
        if (typeof config === 'function') {
            me.fnOnly = true;
            me.validate = config;
        }
        else {
            me.initConfig(config);
        }
        if(I18N && I18N.isReady){
            me.onLocalized();
        }
        I18N.on('ready', me.onLocalized, me);
    },

    onLocalized(){
        let me = this,
            langMessage = me.getLangMessage();
        if(!langMessage && me.getMessage){
            me.setLangMessage(me.getMessage());
        }
        let message = me.getLangMessage();
        message && me.setMessage(I18N.get(message));
    },


})
