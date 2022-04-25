Ext.define('Common.ux.multilingual.FormController', {
    extend: 'Common.ux.form.BaseController',
    alias:'controller.multilingualformcontroller',

    init(){
        let  me = this,
            list = me.getView().getList(),
            isPhone = Ext.platformTags.phone;
        me.list = list;
        me.callParent();
        isPhone && list.on('childtap', me.onListChildTap, me);
    },

    initParams(){
        let me = this,
            view = me.getView(),
            params = ViewMgr.getParams(view.xtype),
            config = params.config,
            record = params.record,
            store = record.store || record.getTreeStore(),
            field = store.messageField,
            list = me.list;
        params.remoteController && view.setRemoteController(params.remoteController);
        view.setTitle(`${I18N.get('Multilingual')}::${record.get(field)}`);
        me.record = record;
        view.setEntityName(config.entityName);
        view.setResourceName(config.resourceName);
        view.permissionGroup = config.permissionGroup;
        view.permissionName = config.permissionName;
        list.setRecord(record);
    },

    getStore(){
        return this.list.getStore().source;
    },

    onSave(){
        let me = this,
            view = me.getView(),
            record = me.record,
            entityName = view.getEntityName(),
            store = me.getStore(),
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
        Http.put(URI.crud(entityName, record.getId(), 'translations'), Object.values(data))
            .then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
    },

    onListChildTap(sender, location, eOpts){
        if(!Format.checkTargetCls(location, 'x-editable')) return;
        let me = this,
            record = location.record;
            dlg = ViewMgr.getDialog('uxmultilingualedit');
        dlg.resourceName = me.resourceName;
        dlg.callback = Ext.bind(me.updateFieldSuccess, me);
        dlg.setField({ 
            field: record.getId(), 
            type: 'textarea',
            value: record.get('value'),
            title: record.get('languageText') + ':' + record.get('label')
        });
        dlg.show();
    },

    updateFieldSuccess(id, value){
        let me = this,
            store = me.getStore(),
            record = store.getById(id);
        if(!record) return;
        record.set('value', value);
    }

});