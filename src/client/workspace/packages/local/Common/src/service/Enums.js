Ext.define('Common.core.service.Enums', {
    alternateClassName: 'Enums',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable'
    ],


    requires:[
        //'Common.data.store.Enums',
        'Common.core.service.Config',
    ],
    
    isReady: false,
    constructor(config){
        let me = this;
        me.mixins.observable.constructor.call(me, config);
    },

    init(){
        let me = this,
            store = me.getStore();
        me.defaultValue = {};
        store.on('load', me.onStoreLoad, me);
        store.load();
    },

    getStore(){
        let me = this,
            store = me.store;
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
        Ext.iterate(data, (k,m)=>{
            if(m.text !== v) return;
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

    doDestroy() {
        let me = this;
        me.store = null;
        Ext.each(me.enumNames, name=>{
            me[name] = null;
        })
        me.enumNames = null;
    },


    privates:{
        store : null,

        onStoreLoad(store, records, successful, operation, eOpts ){
            let me = this,
                names = [];
            if(!successful) return;
            records.forEach(record => {
                let name = Format.uncapitalize(record.get('name')),
                    data = me[name];
                if(!data){
                    names.push(name);
                    data = me[name] = {};
                }
                let d = Ext.clone(record.data);
                data[Format.uncapitalize(record.get('text'))] = d;
                if(record.get('isDefault')) me.defaultValue[name] = d;
            });
            me.updateModelFieldDefaultValue();
            me.enumNames = names;
            me.isReady = true;
            me.fireEvent('ready',me);
        },

        updateModelList:{
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
