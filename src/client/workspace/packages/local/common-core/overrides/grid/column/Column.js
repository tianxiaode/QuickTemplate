Ext.define('Common.overrides.grid.column.Column', {
    override: 'Ext.grid.column.Column',

    initialize(){
        let me = this,
            grid = me.getGrid(),
            store = grid && grid.getStore();
        me.callParent();

        if(!store) return;

        me.setSortable(store.sortFields.has(me.getDataIndex()));
    },

    applyTpl(config) {
        let me = this,
            tpl = Ext.XTemplate.get(config),
            store = me.getGrid().getStore();
        
        tpl.highlight = Ext.bind(Format.gridHighlight, this, [store], true);
        return tpl;
    },

    applyRenderer(renderer){
        if(Ext.isString(renderer)){
            if(Format[renderer]) return Format[renderer];
        }
        return renderer;
    }


});