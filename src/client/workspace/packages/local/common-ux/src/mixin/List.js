Ext.define('Common.mixin.List',{
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.grid.Grid',
        'Common.ux.grid.Tree',
        'Common.ux.dataview.List'
    ],

    config:{
        list: null,
    },


    createList(config) {
        return Ext.apply({ ownerCmp: this }, config);
    },

    applyList(config, old) {
        return Ext.updateWidget(old, config,this, 'createList');
    },

    updateList(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('list');
    }


})