Ext.define('Common.service.Storage', {
    alternateClassName: 'AppStorage',

    statics:{
        get(key){
            let me = this;
                store = me.store;
            if(!store) {
                store = me.store = window.localStorage;
            }
            return store.getItem(key) || Ext.util.Cookies.get(key);
        },
    
        set(key, value){
            let me = this,
                store = me.store;
            if(store){
                store.setItem(key,value);
                return;
            }
            Ext.util.Cookies.set(key,value);
        },
    
        remove(key){
            let me = this,
                store = me.store;
            if(store){
                store.removeItem(key);
                return;
            }
            Ext.util.Cookies.clear(key);
        },
    
    }


});