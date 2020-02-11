Ext.define('Common.Overrides.desktop.grid.selection.Model',{
    override: 'Ext.grid.selection.Model',

    selectAll: function(suppressEvent) {
        var me = this,
            sel = me.getSelection(),
            doSelect;

        if (me.getRows()) {
            sel = me.getSelection('records');
            doSelect = true;
        }
        else if (me.getCells()) {
            sel = me.getSelection('cells');
            doSelect = true;
        }
        else if (me.getColumns()) {
            sel = me.getSelection('columns');
            doSelect = true;
        }

        if (doSelect) {
            sel.selectAll(suppressEvent); // populate the selection with the records
            me.fireEvent('selectAll');
        }
    },

    /**
     * Clears the selection.
     * @param {Boolean} [suppressEvent] Pass `true` to prevent firing the
     * `{@link #selectionchange}` event.
     */
    deselectAll: function(suppressEvent) {
        var sel = this.getSelection();
        if (sel && sel.getCount()) {
            sel.clear(suppressEvent);
            this.fireEvent('deselectAll');
        }
    },

    /**
     * @private
     */
    toggleAll: function(header, e) {
        var me = this,
            sel = me.getSelection();
        e.stopEvent();
        // Not all selected, select all
        if (!sel || (sel.view.store.isVirtualStore && !sel.isAllSelected() || (!sel.view.store.isVirtualStore && !sel.allSelected))) {
            me.selectAll();
        }
        else {
            me.deselectAll();
        }

        me.updateHeaderState();
        me.lastColumnSelected = null;
    }



});