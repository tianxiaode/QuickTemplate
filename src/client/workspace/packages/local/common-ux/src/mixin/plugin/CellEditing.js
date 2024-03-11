Ext.define('Common.mixin.plugin.CellEditing',{
    extend: 'Common.mixin.Base',

    requires:[
        'Ext.grid.plugin.CellEditing'
    ],

    config:{
        cellEditing: null
    },

    cellEditingListener: null,
    cellEditingPluginId: null,

    applyCellEditing(config){
        if(!config) return config;
        return Ext.apply({
            type: "gridcellediting",
            triggerEvent: "Tap",
            selectOnEdit: true           
        }, config)
    },

    updateCellEditing(config){
        let me = this,
            list = me.getList() || me,
            plugin;
        me.cellEditingPluginId && list.removePlugin(me.cellEditingPluginId);
        me.cellEditingListener && Ext.destroy(me.cellEditingListener);

        if(config){
            plugin = list.addPlugin(config);
            me.cellEditingPluginId = plugin.id;
            me.cellEditingListener = list.on({
                beforestartedit: me.onCellEditingBeforeStartEdit,
                complete: me.onCellEditingComplete,
                scope: me,
                destroyable: true
            })
        }
    },

    onCellEditingBeforeStartEdit(editor, boundEl, value, The, eOpts){
        Logger.debug(this.onCellEditingBeforeStartEdit, value);
    },

    onCellEditingComplete(editor, value, startValue, The, eOpts) {
        Logger.debug(this.onCellEditingComplete, value);
    },

    doDestroy() {
        this.destroyMembers( 'cellEditing');
        Ext.destroy(this.cellEditingListener);
    }


})