Ext.define('Common.mixin.crud.CountMessage',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        after:{
            onListStoreLoad: 'updateCountMessage'
        }
    },
        
    updateCountMessage(store, records, successful, operation, eOpts){
        this.down(`{setDataCount}`).setDataCount(store.getTotalCount());
    }

})
