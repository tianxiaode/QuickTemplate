Ext.define('Common.ux.dialog.Base', {
    extend: "Ext.Dialog",

    isSaveClose: true,
    displayed: true,
    closable: true,
    modal: true,
    width: 400,
    height: 500,
    layout: "vbox",
    padding: "0 0",
    defaultListenerScope: true,
    weighted: true,
    includeResource: true,

    callback: null,
    cancelCallback: null,
    isSaved: false,
    
    close(){
        let me = this,
            isSaved = me.isSaved,
            callback = me.callback,
            cancelCallback = me.cancelCallback,
            args = Array.prototype.slice.call(arguments);
        me.callParent();
        isSaved ? callback && callback.apply(null, args) : cancelCallback && cancelCallback.apply(null, args);
    },

    doDestroy() {
        let me = this;
        me.destroyMembers('callback', 'cancelCallback');
        me.callParent(arguments);
    }

   
});