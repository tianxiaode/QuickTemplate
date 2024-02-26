Ext.define('Common.mixin.data.Store', {
    extend: 'Common.mixin.Listener',

    mixinConfig: {
        configs:true,
        before:{
            doDestroy: 'doDestroy',
        }
    },

    config:{
        storeEventListeners: ['load', 'beforeLoad'],
    },

    storeListeners: null,

    updateStoreEventListeners(events){
        let store = this.getStore();
        if(!store) return;
        this.addEventListeners(store,events, 'Store', 'storeListeners');
    },


    /**
     * 存储加载后的处理
     * @param {存储} store 
     * @param {记录} records 
     * @param {是否成功} successful 
     * @param {操作} operation 
     * @param {操作参数} eOpts 
     */
    onStoreLoad(store, records, successful, operation, eOpts) { },


    /**
     * 存储加载前的操作
     */
    onStoreBeforeLoad(store) {
        if (Ext.isEmpty(store.getProxy().getUrl())) return false;
        // let list = this.getList();
        // Logger.debug(this.onStoreBeforeLoad, list)
        // list && list.deselectAll();
        return true;
    },

    /**
     * 刷新列表
     */
    onRefreshStore() {
        this.getStore().loadPage(1);
    },

    doDestroy() {
        Ext.destroy(this.storeListeners);
    }

})