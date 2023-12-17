Ext.define('Common.ux.grid.selection.Tristate', {
    extend: 'Ext.grid.selection.Model',
    alias: 'selmodel.tristate',

    checkboxDefaults: {
        text: null,
        width: 30,
        cell: {
            cls: Ext.baseCSSPrefix + 'selection-cell',
            xtype: 'uxtristatecheckcell'
        }

    },

    createCheckboxColumn(checkboxDefaults) {
        let me = this,
            config =Ext.apply({
            headerCheckbox: me.getHeaderCheckbox() !== false
        }, checkboxDefaults);
        config.cell.renderer = me.renderer;
        return config;
    },




   selectWithEvent: function(record, e) {
        console.log('selectWithEvent', record)
        var me = this,
            mode = me.getMode(),
            isSelected = me.isSelected(record);

        if (mode === 'multi') {
            me.selectWithEventMulti(record, e, isSelected);
        }
        else {
            if (isSelected) {
                if (me.getDeselectable() &&
                (mode === 'single' && me.getToggleOnClick()) || mode === 'simple' || e.ctrlKey) {
                    me.deselect(record);
                }
            }
            else {
                me.select(record, mode === 'simple');
            }
        }

        // Cache the selection start point
        if (!e.shiftKey && me.isSelected(record)) {
            me.selectionStart = record;
        }
    },


    selectWithEventMulti: function(record, e, isSelected) {
        var me = this,
            shift = e.shiftKey,
            ctrl = e.ctrlKey,
            start = shift ? me.selectionStart : null;

        console.log(record)
        // Shift+Navigate, select range
        if (shift && start) {
            me.selectRange(start, record, ctrl);
        }
        else {
            if (isSelected) {
                me.deselect(record);
            }
            else {
                me.select(record, true);
            }
        }
    },

    //全选的时候需要在处理时自行忽略isSelectable为false的记录
    privates:{
        onNavigate: function(navigateEvent) {
            var me = this,
                view = me.getView(),
                store = me.getStore(),
                selectingRows = me.getRows(),
                selectingCells = me.getCells(),
                selectingColumns = me.getColumns(),
                checkbox = me.getCheckbox(),
                checkboxOnly = me.checkboxOnly,
                mode = me.getMode(),
                location = navigateEvent.to,
                toColumn = location.column,
                record = location.record,
                sel = me.getSelection(),
                ctrlKey = navigateEvent.ctrlKey,
                shiftKey = navigateEvent.shiftKey,
                adding = true,
                isSpace = navigateEvent.getKey() === navigateEvent.SPACE,
                count, changedRow, selectionChanged, selected, continueLocation;

            //解决单选问题
            if(!record.get('isSelectable')) return;

            // Honour the stopSelection flag which any prior handlers may set.
            // A SelectionColumn handles its own processing.
            if (navigateEvent.stopSelection || toColumn === me.checkboxColumn) {
                return;
            }

            // *key* navigation
            if (!navigateEvent.pointerType && !isSpace) {
                // CTRL/key just navigates, does not select
                if (ctrlKey) {
                    return;
                }

                // If within a row and not going to affect cell or column selection, then ignore.
                changedRow = !navigateEvent.from ||
                    (location.recordIndex !== navigateEvent.from.recordIndex);

                if (!changedRow && !(selectingCells || selectingColumns)) {
                    return;
                }
            }

            // Click is the mouseup at the end of a multi-cell/multi-column select swipe; reject.
            if (sel &&
                (sel.isCells || (sel.isColumns && selectingRows && !(ctrlKey || shiftKey))) &&
                sel.getCount() > 1 && !shiftKey && navigateEvent.type === 'click') {
                return;
            }

            // If all selection types are disabled, or it's not a selecting event, return
            if (!(selectingCells || selectingColumns || selectingRows) ||
                !record || navigateEvent.type === 'mousedown') {
                return;
            }

            // Ctrl/A key - Deselect current selection, or select all if no selection
            if (ctrlKey && navigateEvent.keyCode === navigateEvent.A && mode === 'multi') {
                // No selection, or only one, select all
                if (!sel || sel.getCount() < 2) {
                    me.selectAll();
                }
                else {
                    me.deselectAll();
                }

                me.updateHeaderState();

                return;
            }

            if (shiftKey && mode === 'multi') {
                // If the event is in one of the row selecting cells, or cell selecting is
                // turned off
                if (toColumn === me.numbererColumn || toColumn === me.checkColumn ||
                    !(selectingCells || selectingColumns) ||
                    (sel && (sel.isRows || sel.isRecords))) {
                    if (selectingRows) {
                        // If checkOnly is set, and we're attempting to select a row outside
                        // of the checkbox column, reject
                        if (toColumn !== checkbox && checkboxOnly) {
                            return;
                        }

                        // Ensure selection object is of the correct type
                        sel = me.getSelection('records');

                        // First shift
                        if (!sel.getRangeSize()) {
                            if (me.selectionStart == null) {
                                me.selectionStart = location.recordIndex;
                            }

                            sel.setRangeStart(me.selectionStart);
                        }
                        else {
                            // Because a range has already been started, and we are shift-selecting,
                            // we need to continue selection from the last selected location
                            continueLocation = new Ext.grid.Location(view, me.getLastSelected());
                            sel.setRangeStart(continueLocation.recordIndex);
                        }

                        // end the range selection at the current location
                        sel.setRangeEnd(location.recordIndex);
                        selectionChanged = true;
                    }
                }
                // Navigate event in a normal cell
                else {
                    if (selectingCells) {
                        // Ensure selection object is of the correct type
                        sel = me.getSelection('cells');
                        count = sel.getCount();

                        // First shift
                        if (!sel.getRangeSize()) {
                            sel.setRangeStart(
                                navigateEvent.from ||
                                new Ext.grid.Location(me.getView(), { record: 0, column: 0 })
                            );
                        }

                        sel.setRangeEnd(location);
                        adding = count < sel.getCount();
                        selectionChanged = true;
                    }
                    else if (selectingColumns) {
                        // Ensure selection object is of the correct type
                        sel = me.getSelection('columns');

                        if (!sel.getCount()) {
                            sel.setRangeStart(toColumn);
                        }

                        sel.setRangeEnd(toColumn);
                        selectionChanged = true;
                    }
                }
            }
            else {
                me.selectionStart = null;

                if (sel && (mode !== 'multi' || !ctrlKey) && !isSpace) {
                    sel.clear(true);
                }

                // If we are selecting rows and (the event is in one of the row selecting
                // cells or we're *only* selecting rows) then select this row
                if (selectingRows && (toColumn === me.numbererColumn ||
                        toColumn === checkbox || !selectingCells)) {
                    // If checkOnly is set, and we're attempting to select a row outside
                    // of the checkbox column, reject
                    // Also reject if we're navigating by key within the same row.
                    if (toColumn !== checkbox && checkboxOnly || (navigateEvent.keyCode &&
                            navigateEvent.from && record === navigateEvent.from.record)) {
                        return;
                    }

                    // Ensure selection object is of the correct type
                    sel = me.getSelection('records');

                    if (sel.isSelected(record)) {
                        if (ctrlKey || toColumn === checkbox || me.getDeselectable()) {
                            sel.remove(record);
                            selectionChanged = true;
                        }
                    }
                    else {
                        sel.add(record, ctrlKey || toColumn === checkbox);
                        selectionChanged = true;
                    }

                    if (selectionChanged && (selected = sel.getSelected()) && selected.length) {
                        me.selectionStart = store.indexOf(selected.first());
                        sel.setRangeStart(me.selectionStart);
                    }
                }
                // Navigate event in a normal cell
                else {
                    // Prioritize cell selection over column selection
                    if (selectingCells) {
                        // Ensure selection object is of the correct type and cleared.
                        sel = me.getSelection('cells', true);
                        sel.setRangeStart(location);
                        selectionChanged = true;
                    }
                    else if (selectingColumns) {
                        // Ensure selection object is of the correct type
                        sel = me.getSelection('columns');

                        if (ctrlKey) {
                            if (sel.isSelected(toColumn)) {
                                sel.remove(toColumn);
                            }
                            else {
                                sel.add(toColumn);
                            }
                        }
                        else {
                            sel.setRangeStart(toColumn);
                        }

                        selectionChanged = true;
                    }
                }
            }

            // If our configuration allowed selection changes, update check header and fire event
            if (selectionChanged) {
                // Base class reacts to RecordSelection mutating its record Collection
                // It will fire the events and update the checked header state.
                if (!sel.isRecords) {
                    me.fireSelectionChange(null, adding);
                }
            }

            me.lastDragLocation = location;
        },
    
    }



});