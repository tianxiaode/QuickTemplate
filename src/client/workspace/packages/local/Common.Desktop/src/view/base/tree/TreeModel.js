Ext.define('Common.Desktop.view.base.tree.TreeModel',{
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.baseTree',

    requires:[
        'Common.Data.model.SearchTree',
        'Common.Data.model.Tree'
    ],

    data:{
        treeSelected: null
    },

    formulas:{
        isTreeSelected: {
            bind: {
                bindTo: '{treeSelected}'
                //deep: true
            },
            get(rec) {
                let store = this.get('mainStore');
                if(Ext.isEmpty(store)) Ext.raise('No define mainStore');
                let params = store.getProxy().extraParams;
                let categoryId= params.categoryId;
                if(Ext.isEmpty(rec)) return;
                if(rec.getId() === params.categoryId) return;
                params.categoryId = rec ? rec.getId() : '';
                params.categoryName = rec ? rec.get('displayName') : '';
                if(Ext.isEmpty(store.getProxy().getUrl())) return;
                if(store.isVirtualStore) {
                    store.reload()
                }else{
                    store.load();
                }
                return rec;
            }
        }
    },

    stores:{
        treeMainStore:{
            type: 'tree',
            model: 'Common.Data.model.Tree',
            autoLoad: false,
            rootVisible: true,
            root:{
                id: -999,
                displayName: I18N.All,
                expanded: false
            },
            proxy: {
                type: 'format',
                //url: URI.get('productCategory', 'read')
            }
        },
        searchTreeStore:{
            model: 'Common.Data.model.SearchTree',
            autoLoad: false,
            pageSize: 0,
            proxy: {
                type: 'format',
                //url: URI.get('productCategory', 'getAllQuery')
            }
        }
    }
});
