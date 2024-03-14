Ext.define('Common.mixin.plugin.ListPaging',{
    extend: 'Common.mixin.Base',

    requires:[
        'Ext.dataview.plugin.ListPaging'
    ],

    config:{
        listPaging: true
    },

    listPagingPlugin: null,

    updateListPaging(value){
        let me = this,
            list = me.getList() || me;
        if(value === true){
            me.listPagingPlugin = list.addPlugin({
                type: 'listpaging',
                autoPage: true
            });
            Logger.debug(this.updateListPaging, value,  me.getStore().isLoaded());
            if(me.getStore().isLoaded()){
                me.onRefreshStore();
            }
        }else{
            me.listPagingPlugin && list.removePlugin(me.listPagingPlugin, true);
        }
        // me.listPagingPluginId && list.removePlugin(me.listPagingPluginId, true);

        // Logger.debug(this.updateListPaging, config ,list.getStore().isLoaded());
        // if(config){
        //     plugin = list.addPlugin(config);
        //     Logger.debug(this.updateListPaging, plugin);
        //     me.listPagingPluginId = plugin.id;
        //     if(list.getStore().isLoaded()) {
        //         me.onRefreshStore();
        //     }
        // }
        
    },

    doDestroy() {
        this.destroyMembers( 'listPagingPlugin');
    }


})