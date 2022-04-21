Ext.define('Common.ux.multilingual.List',{
    extend: 'Ext.dataview.List',
    xtype: 'uxmultilinguallist',

    requires:[
        'Common.data.store.Multilingual',
        'Common.ux.dataview.plugin.TextEditor',
        'Common.ux.multilingual.ListItem',
    ],

    mixins:[
        'Common.mixin.AjaxFailure'
    ],

    config:{
        fields: null
    },

    store:{
        type: 'multilingual'
    },

    selectable: false,
    readOnly: false,

    groupHeader: {
        tpl: '{name}'
    },

    itemConfig:{
        xtype: 'uxmultilinguallistitem'
    },

    responsiveConfig:{
        'desktop && !cancel':{
            plugins:{
                dataviewtexteditor:{
                    dataIndex: 'value',
                    hasMore: true
                },
            },
        },
    },

    onLocalized(){
        this.callParent();
        this.initData();
    },

    initData(){
        let me = this,
            resourceName = me.getResourceName(),
            fields = me.getFields(),
            langs = I18N.getLanguages(),
            store = me.getStore().source,
            data = [],
            order = 1;
        if(!Ext.isArray(fields)) return;
        fields.forEach(f=>{
            let field = f,
                label = f;
            if(!Ext.isString(f)){
                field = f.name;
                label = f.label || f.name;
            }
            langs.forEach(l=>{
                data.push({
                    id: `${field}_${l.cultureName}`,
                    field: field,
                    language: l.cultureName,
                    label: I18N.get(label, resourceName),
                    languageText: l.displayName,
                    order: order,
                    readOnly: me.readOnly
                })
                order++;
            })
        })
        store.loadData(data);
    },

    updateRecord(record){
        let me = this,
            entityName = me.getEntityName();
        me.mask(I18N.get('LoadingText'));
        Http.get(URI.crud(entityName, record.getId(), 'translations'))
            .then(me.loadDataSuccess, me.onAjaxFailure, null, me);
        
    },

    loadDataSuccess(response){
        let me = this,
            store  = me.getStore(),
            data = Http.parseResponse(response),
            items = data && data.items;
        me.unmask();
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

})