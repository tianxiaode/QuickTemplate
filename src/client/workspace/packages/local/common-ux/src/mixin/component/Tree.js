Ext.define('Common.ux.crud.container.mixin.Tree',{
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.grid.column.Action',
        'Common.ux.grid.Tree'
    ],

    config:{
        tree: null
    },

    createTree(config) {
        return Ext.apply({
            xtype: 'tree',
            isCrudList: true,
            childTap: true,
            autoLoad: false,
            flex: 1,
            weight:200,
            scrollable: 'y',    
            bind:{ store: '{mainStore}'},
            ownerCmp: this,
        }, config);
    },

    applyTree(config, old) {
        return Ext.updateWidget(old, config, this, 'createTree');
    },

    updateTree(config){
        if(!config) return;
        let me = this,
            container = (me.getContainer && me.getContainer()) || me;
        container.add(config);
    },

    doDestroy(){
        this.destroyMembers('tree');
    }

})