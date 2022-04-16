Ext.define('Common.ux.app.DetailInMoreController', {
    extend: 'Ext.app.ViewController',

    currentId: null,
    currentEntity: null,
    morePanel: '[isMorePanel]',

    init(){
        let me = this,
            view = me.getView();
        me.callParent(arguments);
        view.on('hiddenchange', me.onViewHiddenChange, me);
        me.list = view.down('uxdetaillist');
        me.list.el.on('tap', me.onEditor, me, { delegate: '.x-editable'});
    },

    onViewHiddenChange( sender, value, oldValue, eOpts){
        if(value) return;
        this.onRefreshView();
    },

    getRecord(){
        let me = this, 
            panel = me.getView().up(me.morePanel);
        return panel && panel.getRecord();
    },

    isEditable(){
        let me = this,
            view = me.getView(),
            record = me.getRecord(),
            permissions = view.up('[includeResource]').permissions;
        return permissions.update || (record && record.get('editable'));
    },

    onRefreshView(){
        let me = this,
            view = me.getView(),
            record = me.getRecord(),
            id =  record && record.getId();
        if(id === me.currentId) return;
        me.currentId = id;
        me.resourceName = view.resourceName;
        me.entityName = view.entityName;
        me.refreshList();
    },

    refreshList(){
        let me = this,
            list = me.list,
            record = me.getRecord(),
            store = list.getStore(),
            model = record.store.model,            
            data = store.getData().items;
        if(!record) return;
        Ext.each(data ,d=>{
            let f = d.getId(),
                value = record.get(f),
                field = model.getField(f);
            d.set('value', value);
            me.updateItemText(d, f, field, value);
            d.commit();
        })
    },

    updateItemText(record , name ,field, value){
        let me = this;
        if(!field) return;
        field.type === 'string' && record.set('text', Format.defaultValue2(value, 'None'));
        field.type === 'date' && record.set('text', Format.dateTime(value));
        field.type === 'bool' && record.set('text', Format.checkbox(value));
        me.afterUpdateItemText && me.afterUpdateItemText(record, name, field, value);
    },

    onEditor(e, target){
        let me = this,
            view = me.getView(),
            list = me.list,
            store = list.getStore(),
            field = target.getAttribute('data-field'),
            type = me.editFields[field],
            record = store.getById(field),
            resourceName = view.getResourceName();
        if(!type || !record || !me.isEditable()) return;

        let dlg = ViewMgr.getDialog(me.editView, {listeners:{ saved: me.updateFieldSuccess, scope: me }});
        dlg.resourceName = me.resourceName;
        dlg.setField({ 
            field: field, 
            type: type,
            value: record.get('value'),
            title: I18N.get(field, resourceName)
        });
        dlg.setUrl(URI.crud(view.getEntityName(), me.getRecord().getId(), field));
        dlg.show();

    },

    updateFieldSuccess(sender, field , value){
        let me = this,
            record = me.getRecord();
        record.set(field, value);
        record.commit();
        me.refreshList();
    },

    destroy(){
        this.list = null;
        this.callParent(arguments);
    }


}); 