Ext.define('Common.ux.crud.controller.mixin.CountMessage',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            onStoreLoad: 'onStoreLoad'
        }
    },
        
    onStoreLoad(store, records, successful, operation, eOpts){
        let me = this,
            view = me.getView(),  
            countMessage = view.getCountMessage && view.getCountMessage();
        countMessage && countMessage.setCount(store.getTotalCount());
    },

})
