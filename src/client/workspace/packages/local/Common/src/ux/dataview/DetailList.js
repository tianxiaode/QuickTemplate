Ext.define('Common.ux.dataview.DetailList',{
    extend: 'Ext.dataview.List',
    xtype: 'uxdetaillist',

    requires:[
        'Common.data.store.Details',
        'Common.ux.dataview.DetailListItem',
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
        fields: []
    },

    applyFields(fields){
        let store = this.getStore(),
            data = [];
        Ext.each(fields,f=>{
            Ext.isString(f) && data.push({ id: f, label: f, cls: '', value: null, text: null});
            Ext.isObject(f) &&  data.push({ id: f.name, label: f.label, cls: '', value: null, text: null});
        });
        store.loadData(data);
        return fields;
    },

    onLocalized(){
        let me = this,
            resourceName = me.getResourceName(),
            data = me.getStore().getData();
        data.each(r=>{
            r.set('label', I18N.get(r.get('label'), resourceName));
            r.commit();
        })
    },
   
    
})