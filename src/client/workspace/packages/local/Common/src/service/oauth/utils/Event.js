Ext.define('Common.service.oauth.utils.Event',{
    alias: 'oauth.event',

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
        Ext.debug("raise:", ...ev);
        for (const cb of this.callbacks) {
            cb(...ev);
        }
    }


})