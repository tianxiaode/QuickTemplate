Ext.define('Common.ux.crud.container.mixin.List',{
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.dataview.List',
    ],

    mixinConfig: {
        configs: true,
    },

    config:{
        list:{
            xtype: 'uxlist',
            isCrudList: true,
            hasPullRefresh: true,
            childTap: true,
            childLongPress: false,
            weight: 500,
            bind:{ store: '{mainStore}'},    
            selectable:{
                mode: 'MULTI'
            }        
        },
    },

    useList: true,

    createList(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyList(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createList');
    },

    updateList(config){
        if(config && this.useList) this.add(config);
    },

})