Ext.define('Common.ux.multilingual.Form',{
    extend: 'Common.ux.form.Base',

    requires:[
        'Common.ux.multilingual.List',
        'Common.ux.multilingual.FormController'
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

    createList(newCmp) {
        return Ext.apply({
            fields: this.fields,
            ownerCmp: this
        }, newCmp);
    },


    applyList(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createList');
    },

    updateList(config){
        if(!config) return;
        this.add(config);
    }

})