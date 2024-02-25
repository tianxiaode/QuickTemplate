Ext.define('Common.overrides.grid.column.Cloumn', {
    override: 'Ext.grid.column.Column',

    initialize(){
        let me = this;
        if(me.xtype === 'selectioncolumn') return;
        let store = me.getGrid().getStore();
        me.callParent();        
        me.setSortable(store.sortFields.has(me.getDataIndex()));
    },

    applyTpl(config) {
        let me = this,
            tpl = Ext.XTemplate.get(config),
            store = me.getGrid().getStore();
        
        tpl.highlight = Ext.bind(Format.gridHighlight, this, [store], true);
        return tpl;
    }


});