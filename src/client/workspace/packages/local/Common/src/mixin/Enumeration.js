Ext.define('Common.mixin.Enumeration', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        after:{
            initialize: 'initialize',
            doDestroy: 'doDestroy',
            onLocalized: 'onLocalized'
        },                
    },

    config:{
        enumeration: null,
        allItem: null,
        filter: null,
        valueType: 'int',
        defaultItem: null,
    },
    


    initialize(){
        let me = this;
        if(Enums.isReady){
            me.onEnumReady();
            return;
        }
        Enums.on('ready', me.onEnumReady, me, { single: true});
    },

    applyAllItem(item){
        if(Ext.isObject(item)) return;
        return {
            value : item,
            langText: 'All',
            order: -1000,
            id: 'all',
        }
    },


    updateFilter(filter){
        if(!filter) return;
        let store = this.getEnumStore();
        if(store) store.filter(filter);
    },

    updateDefaultItem(item){
        if(!item) return;
        let me = this;
        me.suspendEvent('change');
        me.isField  && me.setValue(item.value);
        if(me.getList){
            let list = me.getList(),
                store = me.getStore(),
                record = store.getById(item.id);
            if(!record) return;
            list.getSelectable().select(record);            
            me.setLangText && me.setLangText(record.get('langText'));
        }
        me.resumeEvent('change');

    },

    updateStore(){
        this.initData();
    },
    

    onEnumReady(){
        this.initData();

    },

    initData(){
        let me = this,
            name = Format.uncapitalize(me.getEnumeration()),
            valueType = me.getValueType(),            
            valueField = valueType === 'int' ? 'value' : 'text',
            defaultItem;
        if(Ext.isEmpty(name)) Ext.raise('No enumeration');
        let enumeration = Enums[name],
            items = [];
        if(Ext.isEmpty(enumeration)) Ext.raise( `No enumeration ${name}`);
        Ext.iterate(enumeration,(k,v)=>{
            let item = {
                value: v[valueField], 
                langText: `${v.name}:${v.text}`, 
                id: v.id, 
                order: v.order, 
                resourceName: v.resourceName
            };
            if(v.isDefault) defaultItem = item;
            items.push(item);
        })

        let all = me.getAllItem();
        if(all) {
            items.push(all);
            if(!defaultItem) defaultItem = all;
        };
        me.getStore().loadData(items);
        me.setDefaultItem(defaultItem);

        me.onLocalized();
        me.getPicker && me.getPicker().setZIndex(1000);
    },

    onLocalized(){
        let me = this,
            store = me.getStore();
        if(!store) return;
        store.each(r=>{
            let lang = r.get('langText')
            r.set('text', I18N.get(lang, me.resourceName));

        })
    },

    doDestroy(){
        let me = this;
        me.list = null;
        me.setDefaultItem(null);
    }

});