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
        let me = this;
        me.getView().unmask();
        let store  = me.lookup('multilingualList').getStore().source,
            data = Http.parseResponseText(response),
            items = data && data.items;
        if(!items) return;        
        items.forEach(r=>{
            Ext.iterate(r, (k, v)=>{
                let record = store.getById(`${k}_${r.language}`);
                if(!record) return;
                record.set('value', r[k]);
    
            })
        })
    },

    // onSave(){
    //     let me = this,
    //         view = me.getView(),
    //         entityName = view.getEntityName(),
    //         record = view.getRecord(),
    //         store = me.store,
    //         data = [];
    //     store.each(r=>{
    //         let v = Object.assign({},r.data);
    //         v.language = r.id;
    //         delete v.id;
    //         data.push(v);
    //     })
    //     Http.put(URI.crud(entityName, record.getId(), 'translations'), data)
    //         .then(me.onSaveSuccess, me.onFailure, null, me);
    // },

    // onSaveSuccess(response){
    //     let me = this;
    //     me.successButton.setHidden(false);
    //     me.errorButton.setHidden(true);
    //     let tooltip = me.successButton.getTooltip();
    //     tooltip.setHtml(I18N.get('UpdateSuccess'));
    //     tooltip.show();
    // },

    // onFailure(response){
    //     let me = this;
    //     me.successButton.setHidden(true);
    //     me.errorButton.setHidden(false);
    //     let tooltip = me.errorButton.getTooltip();
    //     tooltip.setHtml(Failure.getError(response));
    //     tooltip.show();
    // },


});