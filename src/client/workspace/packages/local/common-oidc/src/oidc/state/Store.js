Ext.define('Common.oidc.state.Store',{
    alias: 'oidc.state.store',

    prefix: "oidc.",

    constructor(store, prefix){
        let me = this;
        if(prefix) me.prefix = prefix;
        me.store = store || localStorage;
    },

    async set(key, value){
        let me = this;
        key = me.prefix + key;
        Logger.debug(me.set, `set('${key}')`);
        await me.store.setItem(key, value);
    },

    async get(key){
        let me = this;
        key = me.prefix + key;
        Logger.debug(me.get, `get('${key}')`);
        return await me.store.getItem(key);
    },


    async remove(key){
        let me = this;
        key = me.prefix + key;
        Logger.debug(me.remove, `remove('${key}')`);
        let item = await me.store.getItem(key);
        await me.store.removeItem(key);
        return item;
    
    },

    async getAllKeys(){
        let me = this,
            prefix = me.prefix,
            store = me.store,
            len = await store.length,
            keys = [];
        Logger.debug(me.getAllKeys, `getAllKeys')`);
        for (let index = 0; index < len; index++) {
            let key = await store.key(index);
            if (key && key.startsWith(prefix)) {
                keys.push(key.replace(prefix, ''));
            }
        }
        return keys;
    },


    destroy() {
        this.destroyMembers('store');
        this.callParent();
    }


})
