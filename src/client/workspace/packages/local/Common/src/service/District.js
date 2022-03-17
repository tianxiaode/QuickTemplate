Ext.define('Common.service.District', {
    alternateClassName: 'District',
    singleton: true,

    mixins:[
        'Ext.mixin.Observable'
    ],

    requires:[        
        // 'Common.data.store.TreeSearch',
        // 'Common.data.model.districts.District',
        // 'Common.service.Config'
    ],


    isReady: false,
    constructor(config){
        let me = this;
        me.mixins.observable.constructor.call(me, config);
        if(Config && Config.isReady) me.loadRoot();
        Config.on('ready', me.loadRoot, me);
    },
  
    getRoot(){
        return Ext.clone(this.root);
    },

    getProvince(id){
        return this.getStore().getById(id);
    },


    privates:{
        root: null,

        getStore(){
            let me = this;
            let store = me.store;
            if(!store){
                store = me.store = Ext.create('Common.data.store.TreeSearch',{
                    entity: ['District', 'provinces'],
                    model: 'Common.data.model.districts.District'
                });
            }        
            return store;
        },
    
        loadRoot(){
            let me = this;
            Http.get(URI.crud('District', 'root')).
                then(me.loadRootSuccess, Ext.bind(Failure.ajax,me,[null, true],true), null, me);
        },

        loadRootSuccess(response){
            let me = this,
                result = Http.parseResponseText(response);
            me.root = result.result;
            me.isReady = true;
            me.fireEvent('ready');
        },

        onStoreLoad(store, records, successful, operation, eOpts ){
            let me = this;
            if(!successful) return;
            me.isReady = true;
            me.fireEvent('ready');
        },


    }
});
