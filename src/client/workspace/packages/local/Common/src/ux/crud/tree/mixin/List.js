Ext.define('Common.ux.crud.tree.mixin.List',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            init: 'init'
        }
    },

    init(){
        let me = this,
            view = me.getView(),
            searchList = view.getSearchList();
        if(!searchList) return;
        searchList.on('storechange', me.onSearchStoreChange ,me);
        me.searchList = searchList;
    },

    onSearchStoreChange(){
        
    }
})