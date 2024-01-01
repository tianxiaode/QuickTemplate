Ext.define('Common.overrides.grid.column.Cloumn', {
    override: 'Ext.grid.column.Column',

    initialize(){
        let me = this,
            store = me.getGrid().getStore();
        me.callParent();
        me.setSortable(store.sortFields.has(me.getDataIndex()));
    }

});