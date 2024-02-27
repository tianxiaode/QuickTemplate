Ext.define('Common.mixin.Listener', {
    extend: 'Ext.Mixin',

    addSuperclassMember(name){
        let superclass = this.superclass.superclass;
        if(superclass[name]) return;
        superclass[name] = ()=>{};
    },

    addEventListeners(listener, events, eventPrefix, listenersStoreName){
        let me = this,
            c = Ext.String.capitalize,
            listeners = { scope: me, destroyable: true };
        Ext.each(events, l => {
            let name = `on${c(eventPrefix)}${c(l)}`;
            Logger.debug(this.addEventListeners, name)
            me.addSuperclassMember(name);
            listeners[l.toLocaleLowerCase()] = me[name].bind(me);
        });
        Logger.debug(this.addEventListeners, listeners);
        me[listenersStoreName] = listener.on(listeners);
    }
})
