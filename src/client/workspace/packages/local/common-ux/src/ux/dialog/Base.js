Ext.define('Common.ux.dialog.Base', {
    extend: "Ext.Dialog",

    isSaveClose: true,
    isSaved: false,
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
    
    close(){
        let me = this,
            isSaved = me.isSaved,
            callback = me.callback;
        me.callParent();
        if(isSaved && callback){
            let args = Array.prototype.slice.call(arguments);
            callback.apply(null, args);
        }


    },

    destroy() {
        let me = this;
        me.callback = null;
        me.callParent(arguments);
    }

   
});