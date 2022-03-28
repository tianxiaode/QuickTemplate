Ext.define('Common.ux.multilingual.List',{
    extend: 'Ext.dataview.List',
    xtype: 'uxmultilinguallist',

    requires:[
        'Common.data.store.Multilingual',
        'Common.ux.dataview.plugin.TextEditor'
    ],

    config:{
        fields: null
    },

    store:{
        type: 'multilingual'
    },

    groupHeader: {
        tpl: '{name}'
    },

    itemTpl:`
        <div class="row  px-2 py-3">                
            <div class="col-4 pl-0 h6 m-0 text-dark" >{label}</div>
            <div class="col-8 pr-0 pl-0 h6 m-0 black-54 text-right x-editable-text {value:nullValueColor}" data-id="{id}" >{value:nullValueAndEditMessage}</div>
        </div>

    `,

    responsiveConfig:{
        desktop:{
            plugins:{
                dataviewtexteditor:{
                    dataIndex: 'value',
                },
            },         
        
        },
    },


    userCls: 'listing', 

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
                label = f,
                isMultiline = false;
            if(!Ext.isString(f)){
                field = f.name;
                isMultiline = true;
                label = f.label || f.name;
            }
            langs.forEach(l=>{
                data.push({
                    id: `${field}_${l.cultureName}`,
                    field: field,
                    language: l.cultureName,
                    isMultiline: isMultiline,
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