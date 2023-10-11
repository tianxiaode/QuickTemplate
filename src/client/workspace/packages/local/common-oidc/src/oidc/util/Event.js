Ext.define('Common.oidc.util.Event',{
    alias: 'oidc.event',

    constructor(){
        this.callbacks = [];
    },

    addHandler(cb){
        this.callbacks.push(cb);
        return () => this.removeHandler(cb);    
    },

    removeHandler(cb){
        const idx = this.callbacks.lastIndexOf(cb);
        if (idx >= 0) {
            this.callbacks.splice(idx, 1);
        }
    },

    raise(...ev){
        Ext.Logger.debug("raise:", ...ev);
        for (const cb of this.callbacks) {
            cb(...ev);
        }
    },

    destroy() {
        this.destroyMembers('callbacks');
        this.callParent();
    }

})