Ext.define('Common.ux.dialog.Form', {
    extend: "Common.ux.dialog.Base",

    config:{
        form:{}
    },

    createForm(config){
        return Ext.apply({
            xtype: 'formpanel',
            weight: 100,
            ownerCmp: this
        }, config)
    },



    doDestroy() {
        let me = this;
        me.callback = null;
        me.callParent(arguments);
    }

   
});