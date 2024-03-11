Ext.define('Common.mixin.data.Store', {
    extend: 'Common.mixin.Listener',

    mixinConfig: {
        configs: true,
        before: {
            doDestroy: 'doDestroy',
        },
        // extended(baseClass, derivedClass, classBody){
        //     let storeEventListeners = baseClass.$config.values.storeEventListeners;
        //     if(Ext.isArray(storeEventListeners)){
        //         Ext.each(storeEventListeners, (event)=>{
        //            derivedClass.addMember( `onListStore${Ext.String.capitalize(event)}`, ()=>{});
        //         });
        //     }

        //     Logger.debug(this.extended, baseClass, derivedClass, classBody);
        // }
    },

    config: {
        storeEventListeners: ['load', 'beforeLoad'],
    },

    storeListeners: null,

    updateStoreEventListeners(events) {
        let store = this.getStore();
        if (!store) return;
        this.addEventListeners(store, events, 'ListStore', 'storeListeners');
    },


    /**
     * 存储加载后的处理
     * @param {存储} store 
     * @param {记录} records 
     * @param {是否成功} successful 
     * @param {操作} operation 
     * @param {操作参数} eOpts 
     */
    onListStoreLoad(store, records, successful, operation, eOpts) {},


    /**
     * 存储加载前的操作
     */
    onListStoreBeforeLoad(store) {},

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