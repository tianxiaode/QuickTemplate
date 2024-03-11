Ext.define('Common.mixin.Listener', {
    extend: 'Ext.Mixin',

    addEventListeners(listener, events, eventPrefix, listenersStoreName){
        let me = this,
            c = Ext.String.capitalize,
            listeners = { scope: me, destroyable: true };
        Ext.each(events, l => {
            let name = `on${c(eventPrefix)}${c(l)}`;
            listeners[l.toLocaleLowerCase()] = me[name];
        });
        me[listenersStoreName] = listener.on(listeners);
    }
})
