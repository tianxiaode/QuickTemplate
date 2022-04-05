Ext.define('Common.ux.multilingual.List',{
    extend: 'Ext.dataview.List',
    xtype: 'uxmultilinguallist',

    requires:[
        'Common.data.store.Multilingual',
        'Common.ux.dataview.plugin.TextEditor',
        'Common.ux.multilingual.ListItem',
    ],

    config:{
        fields: null
    },

    store:{
        type: 'multilingual'
    },

    selectable: false,

    groupHeader: {
        tpl: '{name}'
    },

    itemConfig:{
        xtype: 'uxmultilinguallistitem'
    },

    responsiveConfig:{
        desktop:{
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
                    order: order
                })
                order++;
            })
        })
        store.loadData(data);
    }
})