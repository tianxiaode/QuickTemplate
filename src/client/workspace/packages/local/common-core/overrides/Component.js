Ext.define('Common.overrides.Component',{
    override: 'Ext.Component',

    config:{
        entityName: null
    },

    getEntityName(){
        let me = this,
            container = me.up('[_entityName]');
        return me._entityName || (container && container._entityName);
    }

})