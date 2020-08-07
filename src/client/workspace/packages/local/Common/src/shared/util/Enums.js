Ext.define('Common.shared.util.Enums', {
    alternateClassName: 'Enums',
    singleton: true,


    request:[
        'Common.data.store.Enums'
    ],

    isReady: false,
    init(){
        let me = this,
            store = me.getStore();
        store.on('load', me.onStoreLoad, me);
        store.load();
    },

    getStore(){
        const me = this;
        let store = me.store;
        if(!store){
            store = me.store = Ext.create('Common.data.store.Enums');
        }        
        return store;
    },


    getEnumItem(v, name){
        let store = this.getStore(),
            id = `${Ext.util.Format.capitalize(name)}-${v}`;
        return store.getById(id);

    },

    getEnumText(v, name, defaultValue){
            item = this.getEnumItem(v, name);
        return item ? item.get('text')  : defaultValue ;
    },

    privates:{
        store : null,

        onStoreLoad(store, records, successful, operation, eOpts ){
            let me = this;
            if(!successful) return;
            records.forEach(record => {
                let type = record.get('type'),
                    data = me[type];
                if(!data){
                    data = me[type] = {};
                }
                data[record.get('key')] = Ext.clone(record.data);
            });
            Enums.isReady = true;
            Ext.fireEvent('enumsready');
        },


    
    }

});
