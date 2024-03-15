Ext.define('Common.mixin.QueryScope',{
    extend: 'Common.mixin.Base',

    config: {
        queryScope: null
    },

   
    updateQueryScope(value){
        let me = this,
            scope = me.getScope() || me.scope;
        if(!Ext.isEmpty(scope)) return;

        let scopeContainer = me.up(`[${value}]`);
        if(!scopeContainer ) return;
        if(me.setScope) {
            me.setScope(scopeContainer);
        }else{
            me.scope = scopeContainer;
        }
    },

    doDestroy(){
        this.destroyMembers('queryScope');
    }
});
