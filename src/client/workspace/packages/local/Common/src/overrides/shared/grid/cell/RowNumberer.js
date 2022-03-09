/**
 * This column type displays the record index of the record in the store.
 */
Ext.define('Common.overrides.shared.gird.cell.RowNumberer', {
    override: 'Ext.grid.cell.RowNumberer',

    refreshValue: function(context) {
        
        var row = context.row,
            ret;

        if (context.summary) {
            ret = '\xA0';
        }
        else {
            ret = row ? row.getRecordIndex() + 1 : null;
        }

        return ret;
    }
});
