Ext.define('Common.ux.dataview.DetailList',{
    extend: 'Ext.dataview.List',
    xtype: 'uxdetaillist',

    requires:[
        'Common.data.store.Details',
        'Common.ux.dataview.DetailListItem'
    ],

    flex: 1,
    rowLines: false,
    striped: false,

    itemConfig:{
        xtype: 'uxmdetailistitem'
    },

    store:{
        type: 'details'
    },

    config:{
        fields: null
    },

    applyFields(fields){
        fields = fields || [];
        let store = this.getStore(),
            data = [];
        Ext.each(fields,f=>{data.push(this.getFieldData(f))});
        store.loadData(data);
        return fields;
    },

    getFieldData(field){
        let id = field,
            label = field,
            editable = false,
            inputType;
        if(Ext.isObject(field)){
            id = field.name,
            label = field.label || id;
            inputType = field.inputType;
            editable = !!inputType;
        }
        return { id: id, langLabel: label, label: null, cls: '', editable: editable, inputType: inputType, value: null, text: null }
    },

    onLocalized(){
        let me = this,
            resourceName = me.getResourceName(),
            entityName = me.getEntityName(),
            data = me.getStore().getData();
        data.each(r=>{
            r.set('label', I18N.get(r.get('langLabel'), resourceName, entityName));
            r.commit();
        })
    },

    doDestroy() {
        let me = this;
        me.setFields(null);
        me.destroyMembers('fields');
        me.callParent();
    }

    
})