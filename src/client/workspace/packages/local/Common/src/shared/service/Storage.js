Ext.define('Common.shared.service.Storage', {
    alternateClassName: 'StorageService',
    singleton: true,

    get(key){
        const me = this;
            store = me.store;
        return store.getItem(key) || Ext.util.Cookies.get(key);
    },

    set(key, value){
        const me = this,
            store = me.store;
        if(store){
            store.setItem(key,value);
            return;
        }
        Ext.util.Cookies.set(key,value);
    },

    remove(key){
        const me = this,
            store = me.store;
        if(store){
            store.removeItem(key);
            return;
        }
        Ext.util.Cookies.clear(key);
    },


    privates:{
        store : window.localStorage
    }
});