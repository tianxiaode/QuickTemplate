Ext.define('Common.shared.app.MasterDetailModel', {
    extend: 'Ext.app.ViewModel',
    //alias: 'viewmodel.commonshared-master',

  
    formulas:{
        isMasterSelected: {
            bind: {
                bindTo: '{masterSelected}'
                //deep: true
            },
            get(rec) {
                let me = this,
                    store = me.get(me.get('detailStoreName')),
                    paramsMap = me.get('paramsMap');
                if(!store) return;
                let params = store.getProxy().extraParams;
                if(Ext.isEmpty(rec)){
                    store.removeAll();
                    store.commitChanges();
                    return;
                } 
                if(rec.getId() === params[paramsMap.id]) return;
                params[paramsMap.id] = rec ? rec.getId() : '';
                params[paramsMap.name] = rec ? rec.get(paramsMap.nameField) : '';
                if(Ext.isEmpty(store.getProxy().getUrl())) return;
                store.loadPage(1);
                return rec;
            }
        }
    },

    data: {
        masterSelected: null,
        detailStoreName: 'mainStore',
        paramsMap:{
            id: 'categoryId',
            name: 'categoryName',
            nameField: 'displayName'
        }
    }
});