Ext.define('Common.ux.multilingual.Form',{
    extend: 'Common.ux.form.Base',

    requires:[
        'Common.ux.multilingual.List',
        'Common.ux.multilingual.FormController',
        'Common.ux.multilingual.Edit',
    ],


    config:{
        list:{
            xtype: 'uxmultilinguallist',
            reference: 'multilingualList',
            flex:1
        }
    },

    controller: 'multilingualformcontroller',
    hasMessageButton: true,
    minWidth:500,
    maxWidth: 500,

    createList(newCmp) {
        let me = this;
        return Ext.apply({
            fields: me.fields,
            ownerCmp: me
        }, newCmp);
    },


    applyList(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createList');
    },

    updateList(config){
        if(config) this.add(config);
    }

})