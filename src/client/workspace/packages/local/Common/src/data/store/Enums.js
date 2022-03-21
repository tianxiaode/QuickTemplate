Ext.define('Common.data.store.Enums',{
    extend: 'Ext.data.Store',

    requires:[
        'Common.data.model.Enum',
    ],

    model: 'Common.data.model.Enum',
    autoLoad: false,
    pageSize: 0,
    proxy: {
        type: 'format',
        url: URI.get('Configuration', 'enums')
    },

    listeners:{
        load: function(store,records, successful, operation, eOpts){
            let me = this;
            let list = me.updateModelList;
            for (const model of Object.keys(list)) {
                let cls = Ext.ClassManager.get(model);
                if(cls && Ext.isArray(cls.fields)){
                    for (const item of list[model]) {
                        me.updateModelFieldDefaultValue(cls.fields, records, item.fieldName, item.enumName);
                    }
                }
            }
        }
    },

    updateModelList:{
    },

    updateModelFieldDefaultValue: function(fields, records, fieldName, enumType){
        let field = fields.find(m=>m.name === fieldName);
        let record = records.find(m=>m.get('type').toLowerCase() === enumType.toLowerCase() && m.get('isDefault'));
        if(field && record){
            field.defaultValue = record.get('value');
        }
    }
})