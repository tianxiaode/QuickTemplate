Ext.define('Common.ux.multilingual.List',{
    extend: 'Ext.dataview.List',
    xtype: 'uxmultilinguallist',

    requires:[
        'Common.data.store.Multilingual',
        'Common.ux.multilingual.ListItem'
    ],

    mixins:[
        'Common.mixin.AjaxFailure',
        'Common.mixin.Editor',
    ],

    

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

    initData(fields){
        let me = this,
            resourceName = me.getResourceName(),
            langs = I18N.getLanguages(),
            store = me.getStore().source,
            data = [],
            order = 1;
        if(!Ext.isArray(fields)) return;
        fields.forEach(f=>{
            let field = f.name,
                label = f.langText || f.name;
            if(!f.isTranslation) return;
            langs.forEach(l=>{
                data.push({
                    id: `${field}_${l.cultureName}`,
                    field: field,
                    language: l.cultureName,
                    label: I18N.get(label, resourceName),
                    languageText: l.displayName,
                    order: order,
                    readOnly: me.readOnly,
                    inputType: 'more',
                    value: null
                })
                order++;
            })
        })
        store.loadData(data);
        me.isInitData = true;
    },

    updateRecord(record){
        let me = this,
            entityName = me.getEntityName();
        if(me.currentEntity != entityName) {
            me.currentEntity = entityName;
            me.initData(record.getFields());
        }
        
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