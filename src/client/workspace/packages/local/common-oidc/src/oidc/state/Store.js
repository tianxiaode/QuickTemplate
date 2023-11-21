Ext.define('Common.oidc.state.Store',{
    alias: 'oidc.state.store',

    prefix: "oidc.",

    constructor(store, prefix){
        let me = this;
        if(prefix) me.prefix = prefix;
        me.store = store || localStorage;
    },

    async set(key, value){
        let me = this,
            key = me.prefix + key;
        await me.store.set(key, value);
    },

    async get(key){
        let me = this,
            key = me.prefix + key;
        return await me.store.get(key, value);
    },


    async remove(){
        let me = this,
            key = me.prefix + key,
            item = await me.store.get(key);
        await me.store.remove(key);
        return item;
    
    },

    async getAllKeys(){
        let me = this,
            prefix = me.prefix,
            store = me.store,
            len = await store.length,
            keys = [];
        for (let index = 0; index < len; index++) {
            let key = await store.key(index);
            if (key && key.indexOf(prefix) === 0) {
                keys.push(key.substr(prefix.length));
            }
        }
        return keys;
    },


    destroy() {
        this.destroyMembers('store');
        this.callParent();
    }


})
