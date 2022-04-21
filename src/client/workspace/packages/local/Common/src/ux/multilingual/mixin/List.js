Ext.define('Common.ux.multilingual.mixin.List',{
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.multilingual.List',
    ],

    mixinConfig: {
        configs: true,
    },

    config:{
        list:{
            xtype: 'uxmultilinguallist',
            reference: 'multilingualList',
            flex:1
        }
    },

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