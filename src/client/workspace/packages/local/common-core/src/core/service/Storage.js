Ext.define('Common.core.service.Storage', {
    alternateClassName: 'AppStorage',
    singleton: true,

    requires:[
        'Ext.util.Cookies'
    ],

    store: null,

    constructor(){
        let me = this;
        me.store = window.localStorage || Ext.util.Cookies;
    },

    get(key){    
        let store = this.store;
        if(store.getItem){
            return store.getItem(key);
        }
        return store.get(key);
    },

    set(key, value){
        let store = this.store;
        if(store.setItem){
            store.setItem(key, value);
            return;
        }
        store.set(key,value);
    },

    remove(key){
        let store = this.store;
        if(store.removeItem){
            store.removeItem(key);
            return;
        }
        Ext.util.Cookies.clear(key);
    },

    getAllKeys(value, startsWith, endsWith, ignoreCase){
        let me = this,
            store = this.store,
            keys = [],
            regex = value ? Ext.String.createRegex(value, startsWith, endsWith, ignoreCase) : null,
            ln;
        if(store.getItem){
            ln = store.length;
            for(let i = 0; i < ln; i++){
                let key  = store.key(i);
                me.addKey(regex, keys, key);
            }
            return keys;
        }
        let parts = document.cookie.split('; ');
        ln = parts.length;
        for(let i = 0; i < ln; i++){
            let item = parts[i].split('=');
            me.addKey(regex, keys, item[0]);
        }            
         
        return keys;
    },

    addKey(regex, keys, key){
        if(!regex){
            keys.push(key);
            return;
        }
        if(regex.test(key)){
            keys.push(key);
        }
    },

    destroy() {
        let me = this;
        me.store = null;
        me.callParent();
    }


    

});