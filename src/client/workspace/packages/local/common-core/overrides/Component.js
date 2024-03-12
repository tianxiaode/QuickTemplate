Ext.define('Common.overrides.Component',{
    override: 'Ext.Component',

    getEntityName(){
        let me = this,
            container = me.up('[_entityName]');
        return me._entityName || (container && container._entityName);
    }

})