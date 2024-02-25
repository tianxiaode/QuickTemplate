Ext.define('Common.mixin.data.Store', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before: {
            doDestroy: 'doDestroy'
        }
    },

    storeListeners: null,

    initStoreListeners() {
        let me = this,
            store = me.getStore(),
            listeners = { scope: me, destroyable: true };
        Ext.each(arguments, name => {
            let fn = `onStore${Ext.String.capitalize(name)}`;
            me.superclass[fn] = () =>{};
            listeners[name.toLocaleLowerCase()] = me[fn];
        });
        Logger.debug(this.initStoreListeners, listeners);
        me.storeListeners = store.on(listeners);
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
        this.doDeselectAll();
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