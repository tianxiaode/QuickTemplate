Ext.define('Common.ux.grid.cell.Highlight', {
    extend: 'Ext.grid.cell.Cell',
    xtype: 'uxhighlightcell',

    config:{
        renderer: null
    },

    refreshValue(context) {
        let me = this,
            value = me.callParent(arguments),
            store = context.store;
        return Format.gridHighlight(value, store);
    }


});