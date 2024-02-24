Ext.define('Common.overrides.grid.column.Cloumn', {
    override: 'Ext.grid.column.Column',

    initialize(){
        let me = this;
        if(me.xtype === 'selectioncolumn') return;
        let store = me.getGrid().getStore();
        me.callParent();        
        me.setSortable(store.sortFields.has(me.getDataIndex()));
    }

});