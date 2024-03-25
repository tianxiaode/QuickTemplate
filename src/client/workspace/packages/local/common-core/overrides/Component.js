Ext.define('Common.overrides.Component', {
    override: 'Ext.Component',

    config: {
        entityName: null,
        queryScope: null
    },

    isEnableConfigListener: false,

    initialize(){
        let me = this;
        me.initConfigReadyEvent();
        me.callParent(arguments);
    },

    initConfigReadyEvent(){
        let me = this;
        if(!me.isEnableConfigListener) return;
        me.configListener = Config.on('ready', me.onConfigReady, me);
        if(Config.isReady) me.onConfigReady();
    },

    getEntityName() {
        let me = this,
            container = me.up('[_entityName]');
        return me._entityName || (container && container._entityName);
    },

    resolveListenerScope(defaultScope, skipThis) {
        let me = this,
            queryScope = me.getQueryScope();
        if ((me.isButton || me.isMenuItem || me.isTool) && queryScope) {
            let container = me.up(`[${queryScope}]`);
            if (container) return container;
        }
        return me.mixins.inheritable.resolveListenerScope.call(me, defaultScope, skipThis);
    },

    onConfigReady(){
        Logger.debug(this.onConfigReady, 'onConfigReady');
    },

    doDestroy(){
        Ext.destroy(this.configListener);
        this.callParent(arguments);
    }



})