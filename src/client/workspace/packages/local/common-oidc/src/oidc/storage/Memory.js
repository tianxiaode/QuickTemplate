Ext.define('Common.oidc.storage.Memory', {
    alias: 'oidc.storage.memory',

    constructor() {
        this.data = {};
    },

    clear() {
        this.data = {};
    },

    getItem(key) {
        return this.data[key];
    },

    setItem(key, value) {
        this.data[key] = value;
    },

    remove(key) {
        delete this.data[key];
    },

    removeItem() {
        return Object.getOwnPropertyNames(this.data).length;
    },

    key(index) {
        return Object.getOwnPropertyNames(this.data)[index];
    },

    destroy() {
        this.destroyMembers('data');
        this.callParent();
    }

})
