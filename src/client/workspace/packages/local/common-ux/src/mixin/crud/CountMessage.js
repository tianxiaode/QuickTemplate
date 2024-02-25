Ext.define('Common.mixin.crud.CountMessage',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            onStoreLoad: 'onStoreLoad'
        }
    },
        
    onStoreLoad(store, records, successful, operation, eOpts){
        let countMessage = this.getCountMessage();
        countMessage && countMessage.setCount(store.getTotalCount());
    }

})
