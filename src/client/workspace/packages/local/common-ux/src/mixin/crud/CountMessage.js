Ext.define('Common.mixin.crud.CountMessage',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            onStoreLoad: 'updateCountMessage'
        }
    },
        
    updateCountMessage(store, records, successful, operation, eOpts){
        this.down(`{setDataCount}`).setDataCount(store.getTotalCount());
    }

})
