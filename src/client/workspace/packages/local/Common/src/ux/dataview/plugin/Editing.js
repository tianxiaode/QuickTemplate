
Ext.define('Common.ux.dataview.plugin.Editing', {
    extend: 'Ext.plugin.Abstract',

    requires: [
    ],

    config: {
        /**
         * @private
         */
        view: null,

        /**
         * @cfg {String} triggerEvent
         * An optional pointer event to trigger cell editing.
         *
         * By default, cell editing begins when actionable mode is entered by pressing
         * `ENTER` or `F2` when focused on the cell.
         */
        triggerEvent: 'tap',

        /**
         * @cfg {Boolean} [selectOnEdit=false]
         * Configure as `true` to have the cell editor *select* the cell it is editing (If
         * cell selection enabled), or the record it is editing (if row selection enabled)
         */
        selectOnEdit: null
    },

    init(view) {
        this.setView(view);


        view.$editing = true;
    },

    getEditor(location) {
        var column = location.column,
            fieldName = column.getDataIndex(),
            record = location.record,
            editable = column.getEditable(),
            editor, field;

        if (!(editor = editable !== false && column.getEditor(location.record)) && editable) {
            editor = Ext.create(column.getDefaultEditor());
        }

        if (editor) {
            if (!editor.isCellEditor) {
                // during the construction of the celleditor
                // we need to pass the plugin so it can find
                // the owner grid to relay it's own events
                editor = Ext.create({
                    xtype: 'celleditor',
                    field: editor,
                    plugin: this
                });
            }

            column.setEditor(editor);
            editor.editingPlugin = this;

            field = editor.getField();
            field.addUi('celleditor');

            // Enforce the Model's validation rules
            field.setValidationField(record.getField(fieldName), record);
        }

        return editor;
    },

    getActiveEditor: function() {
        return this.activeEditor;
    },

    updateView(view, oldView) {
        if (oldView) {
            oldView.unregisterActionable(this);
        }

        if (view) {
            view.registerActionable(this);
        }
    },

    activateCell(location) {
        var me = this,
            activeEditor = me.activeEditor,
            previousEditor = me.$previousEditor,
            editor, selModel, result;

        //<debug>
        if (!location) {
            Ext.raise('A grid Location must be passed into CellEditing#activateCell');
        }
        //</debug>

        // Do not restart editor on the same cell. This may happen when an actionable's
        // triggerEvent happens in a cell editor, and the event bubbles up to the
        // NavigationModel which will try to activate the owning cell.
        // In this case, we return the location to indicate that it's still a successful edit.
        if (activeEditor && activeEditor.$activeLocation.cell === location.cell) {
            return activeEditor.$activeLocation;
        }
        else {
            editor = me.getEditor(location);

            if (editor) {
                if (previousEditor) {
                    if (previousEditor.isCancelling) {
                        previousEditor.cancelEdit();
                    }
                    else {
                        previousEditor.completeEdit();
                    }
                }

                result = editor.startEdit(location);

                if (editor.editing) {

                    // Select the edit location if possible if we have been configured to do so.
                    if (me.getSelectOnEdit()) {
                        selModel = me.getGrid().getSelectable();

                        if (selModel.getCells()) {
                            selModel.selectCells(location, location);
                        }
                        else if (selModel.getRows()) {
                            selModel.select(location.record);
                        }
                    }

                    me.$previousEditor = editor;

                    return result;
                }
                else {
                    editor.onEditComplete(false, true);
                }
            }
        }
    },

    // for compatibility
    startEdit(record, column) {
        console.log('startEdit')
        this.activateCell(new Ext.grid.Location(this.getGrid(), {
            record: record,
            column: column
        }));
    },

    destroy() {
        var view = this.getView();

        if (view) {
            view.$editing = false;
        }

        this.$previousEditor = null;
        this.callParent();
    }
});
