Ext.define('Common.ux.app.DetailInMoreController', {
    extend: 'Ext.app.ViewController',

    currentId: null,
    currentEntity: null,
    morePanel: '[isMorePanel]',

    init(){
        let me = this;
        me.callParent(arguments);
        me.getView().on('hiddenchange', me.onViewHiddenChange, me);
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
        let record = this.getRecord();
        return record && record.get('editable');
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
            list = me.lookup('detailList'),
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
        (field && (field.type === 'string')) && record.set('text', Format.defaultValue2(value, 'None'));
        (field && (field.type === 'date')) && record.set('text', Format.dateTime(value));
    }
}); 