Ext.define('Common.overrides.shared.data.validator.Validator',{
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
        Ext.on('i18nready', me.onLocalized, me);
    },

    onLocalized(){
        let me = this,
            langMessage = me.getLangMessage();
        if(!langMessage && me.getMessage){
            me.setLangMessage(me.getMessage());
        }
        let message = me.getLangMessage();
        if(message){
            me.setMessage(I18N.get(message));
        }
    },


})
