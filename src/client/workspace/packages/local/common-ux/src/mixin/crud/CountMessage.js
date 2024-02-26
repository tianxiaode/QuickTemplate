Ext.define('Common.mixin.crud.CountMessage',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            onStoreLoad: 'updateCountMessage'
        }
    },
        
    updateCountMessage(store, records, successful, operation, eOpts){
        Logger.debug(this.updateCountMessage)
        let countMessage = this.getCountMessage();
        countMessage && countMessage.setCount(store.getTotalCount());
    }

})
