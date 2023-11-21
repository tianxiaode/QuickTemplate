Ext.define('Common.oidc.event.Event', {
    alias: 'oidc.event.event',

    name: null,

    constructor(name) {
        let me = this;
        me.name = name;
        me.callbacks = [];
    },

    addHandler(cb) {
        this.callbacks.push(cb);
        return () => this.removeHandler(cb);
    },

    removeHandler(cb) {
        let idx = this.callbacks.lastIndexOf(cb);
        if (idx >= 0) {
            this.callbacks.splice(idx, 1);
        }
    },

    raise(...ev) {
        Logger.debug("raise:", ...ev);
        for (let cb of this.callbacks) {
            cb(...ev);
        }
    },

    destroy() {
        this.destroyMembers('callbacks');
        this.callParent();
    }

})