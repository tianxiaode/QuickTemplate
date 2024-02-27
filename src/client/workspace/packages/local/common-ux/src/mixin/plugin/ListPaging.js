Ext.define('Common.mixin.plugin.ListPaging',{
    extend: 'Common.mixin.Base',

    requires:[
        'Ext.dataview.plugin.ListPaging'
    ],

    config:{
        listPaging: null
    },

    listPagingPluginId: null,

    applyListPaging(config){
        if(!config) return config;
        return Ext.apply({
            type: "listpaging",
            autoPage: true
        }, config)
    },

    updateListPaging(config, old){
        let me = this,
            list = me.getList() || me,
            plugin;
        Logger.debug(this.updateListPaging, config,old,  me.listPagingPluginId);
        me.listPagingPluginId && list.removePlugin(me.listPagingPluginId);

        if(config){
            plugin = list.addPlugin(config);
            me.listPagingPluginId = plugin.id;
            Logger.debug(this.updateListPaging, plugin);
        }
    },

    doDestroy() {
        this.destroyMembers( 'listPaging');
    }


})