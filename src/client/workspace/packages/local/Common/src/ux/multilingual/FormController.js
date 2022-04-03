Ext.define('Common.ux.multilingual.FormController', {
    extend: 'Common.ux.form.BaseController',
    alias:'controller.multilingualformcontroller',

    initParams(){
        let me = this,
            view = me.getView(),
            params = ViewMgr.getParams(view.xtype),
            record = params.record,
            field = record.store.messageField;
        params.remoteController && view.setRemoteController(params.remoteController);
        view.setTitle(`${I18N.get('Multilingual')}::${record.get(field)}`);
        me.record = record;
        me.loadData(record);
    },

    loadData(record){
        let me = this,
            view = me.getView(),
            entityName = view.getEntityName();
        view.mask(I18N.get('LoadingText'));
        Http.get(URI.crud(entityName, record.getId(), 'translations'))
            .then(me.loadDataSuccess, me.onSubmitFailure, null, me);
    },

    loadDataSuccess(response){
        let me = this,
            store  = me.lookup('multilingualList').getStore().source,
            data = Http.parseResponse(response),
            items = data && data.items;
        me.getView().unmask();
        if(!items) return;
        store.each(r=>{
            r.set('value', null);
        })
        items.forEach(r=>{
            Ext.iterate(r, (k, v)=>{
                let record = store.getById(`${k}_${r.language}`);
                if(!record) return;
                record.set('value', r[k]);
    
            })
        })
    },

    onSave(){
        let me = this,
            view = me.getView(),
            record = me.record,
            entityName = view.getEntityName(),
            list = me.lookup('multilingualList'),
            store = list.getStore(),
            data = {};
        store.each(r=>{
            let value = r.get('value'),
                language = r.get('language'),
                field = r.get('field');
                d = data[language];
            if(!d) {
                d = data[language] = { language: language };
            }
            d[field] = value;
        });
        view.mask(I18N.get('Saving'));
        console.log(data, Object.values(data))
        Http.put(URI.crud(entityName, record.getId(), 'translations'), Object.values(data))
            .then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
    },

});