/**
 * 枚举存储
 */
Ext.define('Common.Data.store.Enums',{
    extend: 'Ext.data.Store',
    storeId: 'EnumsStore',

    requires:[
        'Common.Data.model.Enum',
        //'Common.Shared.util.Url'
    ],

    //fields:['id','text','type', 'value', 'order',],
    model: 'Common.Data.model.Enum',
    autoLoad: false,
    pageSize: 0,
    proxy: {
        type: 'format',
        //url: URI.get('Configuration', 'GetAllEnum')
    },

    listeners:{
        load: function(store,records, successful, operation, eOpts){
            let me = this;
            let list = me.updateModelList;
            //根据枚举值更新模型枚举字段的默认值
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

    //需要更新的默认值的模型枚举字段列表
    updateModelList:{
    },

    /**
     * 更新模型枚举字段的默认值
     * @param {字段列表} fields 
     * @param {记录} records 
     * @param {字段名} fieldName 
     * @param {枚举类型} enumType 
     */
    updateModelFieldDefaultValue: function(fields, records, fieldName, enumType){
        let field = fields.find(m=>m.name === fieldName);
        let record = records.find(m=>m.get('type').toLowerCase() === enumType.toLowerCase() && m.get('isDefault'));
        if(field && record){
            field.defaultValue = record.get('value');
        }
    }
})