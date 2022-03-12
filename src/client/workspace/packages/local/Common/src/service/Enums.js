Ext.define('Common.service.Enums', {
    alternateClassName: 'Enums',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable'
    ],


    requires:[
        'Common.data.store.Enums',
        'Common.service.Config',
    ],
    
    isReady: false,
    constructor(config){
        let me = this;
        me.mixins.observable.constructor.call(me, config);
        if(Config && Config.isReady) me.init();
        Config.on('ready', me.init, me);
    },
  
    init(){
        let me = this,
            store = me.getStore();
        me.defaultValue = {};
        store.on('load', me.onStoreLoad, me);
        store.load();
    },

    getStore(){
        let me = this;
        let store = me.store;
        if(!store){
            store = me.store = Ext.create('Common.data.store.Enums');
        }        
        return store;
    },


    getEnumItem(v, name, isTextValue){
        name = Format.uncapitalize(name);
        if(!isTextValue){
            let store = Enums.getStore(),
                id = `${name}-${v}`; 
            return store.getById(id);    
        }
        let data = this[name];
        let item ;
        Ext.Object.each(data, (k,m)=>{
            if(m.textValue !== v) return;
            item = m;
            return false;
        });
        return item;

    },

    getEnumText(v, name, defaultValue, isTextValue){
        let item = Enums.getEnumItem(v, name, isTextValue);
        return item ? (item.text || (item.data && item.data.text) ) : defaultValue ;
    },

    add(name, enums){
        name = Format.uncapitalize(name);
        Enums[name] = enums;
    },

    privates:{
        store : null,

        onStoreLoad(store, records, successful, operation, eOpts ){
            let me = this;
            if(!successful) return;
            records.forEach(record => {
                let type = Format.uncapitalize(record.get('type')),
                    data = me[type];
                if(!data){
                    data = me[type] = {};
                }
                let d = Ext.clone(record.data);
                data[record.get('key')] = d;
                if(record.get('isDefault')) me.defaultValue[type] = d;
            });
            me.updateModelFieldDefaultValue();
            me.isReady = true;
            me.fireEvent('ready');
        },

        updateModelList:{
            'merchantCategoryCode': {
                'clearingaccountbase' : 'mcc'
            },
            'merchantType':{
                'clearingaccountbase' : 'merchantType'
            },
            'bankAccountUsageType':{
                'clearingaccountbank': 'accountUsageType'
            },
            'bankAccountType':{
                'clearingaccountbank': 'accountType'
            },
            'certType':{
                'clearingaccountbase': 'certType'
            },
            'clearingRulePattern':{
                'clearingrule': 'pattern',
                'marketingclearing': 'pattern'
            },
            'marketingType':{
                'marketing': 'type'
            },
            'marketingDiscountType':{
                'marketing': 'discountType'
            }
        },
    
        updateModelFieldDefaultValue(){
            let me = this,
                list = me.updateModelList,
                 values = me.defaultValue;
            Ext.Object.each(list,(k,v)=>{
                let data = values[k];
                if(!data) return;
                Ext.Object.each(v,(entity,f)=>{
                    let model = Ext.ClassManager.getByAlias(`entity.${entity}`);
                    if(!model) return;
                    let fields = model.fields;
                    let field = fields.find(n=>n.name === f);
                    if(!field) return;
                    field.defaultValue = data.value;
                    if(field.type === 'string') field.defaultValue = data.textValue;
                })
            })
        }
    
    
    }

});
