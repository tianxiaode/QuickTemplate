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
        Logger.debug(this.removeHandler, this.name, idx, this.callbacks, cb);
        if (idx >= 0) {
            this.callbacks.splice(idx, 1);
        }
    },

    raise(...ev) {
        let me = this;
        Logger.debug(me.raise, me.name, "raise:", ...ev, this.callbacks);
        for (let cb of this.callbacks) {
            cb(...ev);
        }
    },

    destroy() {
        this.destroyMembers('callbacks');
        this.callParent();
    }

})