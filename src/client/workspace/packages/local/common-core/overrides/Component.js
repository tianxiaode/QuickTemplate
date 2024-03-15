Ext.define('Common.overrides.Component', {
    override: 'Ext.Component',

    config: {
        entityName: null,
        queryScope: null
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
    }


})