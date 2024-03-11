Ext.define('Common.mixin.crud.CountMessage',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        after:{
            onListStoreLoad: 'updateCountMessage'
        }
    },
        
    updateCountMessage(store, records, successful, operation, eOpts){
        Logger.debug(this.updateCountMessage, 'updateCountMessage called');
        this.down(`{setDataCount}`).setDataCount(store.getTotalCount());
    }

})
