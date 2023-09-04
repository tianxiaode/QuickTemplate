Ext.define('Common.ux.crud.container.mixin.List',{
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.dataview.List'
    ],

    config:{
        list: null,
    },


    createList(config) {
        return Ext.apply({
            xtype: 'uxlist',
            isCrudList: true,
            hasPullRefresh: true,
            childTap: true,
            childLongPress: false,
            weight: 200,
            bind:{ store: '{mainStore}'},    
            selectable:{
                mode: 'MULTI'
            },
            ownerCmp: this,
        }, config);
    },

    applyList(config, old) {
        return Ext.updateWidget(old, config,this, 'createList');
    },

    updateList(config){
        if(!config) return;
        let me = this,
            container = (me.getContainer && me.getContainer()) || me;
        container.add(config);
    },

    doDestroy(){
        this.destroyMembers('list');
    }


})