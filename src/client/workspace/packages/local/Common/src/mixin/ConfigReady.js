Ext.define('Common.mixin.ConfigReady', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        before:{
            initialize: 'initialize',
        },
    },


    initialize(){
        let me = this;
        Config.isReady && me.onConfigReady();
        Config.on('ready', me.onConfigReady, me);
    },

    onConfigReady: Ext.emptyFn
});