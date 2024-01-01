Ext.define('Common.core.data.TreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.formattreestore',

    mixins:[
        'Common.core.mixin.data.StoreExtensions'
    ],

    rootVisible: false,
    remoteFilter: false,
    proxy: 'format',
    remoteRoot: true,
    isRootReady: false,

    root:{
        id: null,
        expanded: false
    },

    updateModel(){
        let me = this;
        me.callParent(arguments);
        if(me.remoteRoot){
            me.loadRoot();
        }
    },

    load(options){
        let me = this;
        if(me.remoteRoot && !me.isRootReady){
            return;
        }
        me.callParent(arguments);
    },

    privates:{
        loadRoot(){
            let me = this,
                entityName = me.getEntityName(),
                url = URI.get(Ext.util.Inflector.pluralize(entityName), 'root');
            me.isRootReady = false;
            Http.get(url).then(me.onRootLoaded.bind(me), Alert.ajax);        
        },
    
        onRootLoaded(response){
            let me = this,
                data = response.request.getJson(),
                root = me.getRoot();
            me.isRootReady = true;
            root.set(data);
            me.load({node: root});
        }    
    }

});
