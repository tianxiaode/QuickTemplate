Ext.define('Common.Overrides.desktop.grid.Grid',{
    override: 'Ext.grid.Grid',

    privates: {
        updateColumns: function(columns) {
            if(!Ext.isArray(columns) && columns.defaults){
                let newColumns = [];
                for (const column of columns.items) {
                    newColumns.push(Ext.applyIf(column,columns.defaults));
                }
                columns =newColumns;
            }
            var me = this,
                header = me.getHeaderContainer(),
                count = columns && columns.length,
                persist = me.registeredColumns;
 
            // If the header container is an instance, then it's already
            // peeked at the columns config and included it, so bail out
            if (header) {
 
                // With a new column set, the rowHeight must be invalidated.
                // The new columns may bring in a different data shape.
                me.rowHeight = null;
 
                if (header) {
                    header.beginColumnUpdate();
 
                    if (header.getItems().getCount()) {
                        // Preserve persistent columns
                        if (persist) {
                            header.remove(persist, false);
                        }
 
                        // Also preserve any returning columns...
                        if (count) {
                            header.remove(columns.filter(function(col) {
                                return col.isInstance;
                            }), /* destroy= */ false);
                        }
 
                        header.removeAll(/* destroy= */ true, /* everything= */ true);
                    }
 
                    if (count) {
                        me.initializingColumns = me.isConfiguring;
 
                        header.setColumns(columns);
 
                        // Re-add any persistent columns, any adjusted weights are recalculated
                        if (persist) {
                            header.add(persist);
                        }
 
                        delete me.initializingColumns;
 
                        // TODO: This may cause a change in row heights, currently should
                        // be handled by using variableHeights, but the grid could re-measure as
                        // needed
                        // me.refreshScrollerSize();
                    }
 
                    header.endColumnUpdate();
                }
            }
        }

    }
});