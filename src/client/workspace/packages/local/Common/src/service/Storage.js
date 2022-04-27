Ext.define('Common.service.Storage', {
    alternateClassName: 'AppStorage',
    singleton: true,


    get(key){
        let store = window.localStorage;
        return (store && store.getItem(key)) || Ext.util.Cookies.get(key);
    },

    set(key, value){
        let store = window.localStorage;
        if(store){
            store.setItem(key,value);
            return;
        }
        Ext.util.Cookies.set(key,value);
    },

    remove(key){
        let store = window.localStorage;
        if(store){
            store.removeItem(key);
            return;
        }
        Ext.util.Cookies.clear(key);
    },
    

});