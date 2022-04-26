Ext.define('Common.ux.multilingual.mixin.List',{
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.multilingual.List'
    ],

    mixinConfig: {
        configs: true,
    },

    config:{
        list:{
            xtype: 'uxmultilinguallist',
            flex:1
        }
    },

    createList(newCmp) {
        return Ext.apply({
            ownerCmp: this
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