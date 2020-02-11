/**
 * 修正下拉列表框的一些bug
 */
Ext.define('Common.Desktop.ux.field.ComboBox',{
    extend: 'Ext.field.ComboBox',
    xtype: 'uxcombobox',

    doFilter: function(query) {
        var me = this,
            isLocal = me.getQueryMode() === 'local',
            lastQuery = me.lastQuery,
            store = me.getStore() && me._pickerStore,
            filter = me.getPrimaryFilter(),
            filters = store.getFilters(),
            // Decide if, and how we are going to query the store
            queryPlan = me.beforeFilter(Ext.apply({
                filterGeneration: filter.generation,
                lastQuery: lastQuery || {},
                combo: me,
                cancel: false
            }, query)),
            picker, source;

            // Allow veto.
        if (store && queryPlan !== false && !queryPlan.cancel) {
            // User can be typing a regex in here, if it's invalid
            // just swallow the exception and move on
            if (me.getEnableRegEx()) {
                try {
                    queryPlan.query = new RegExp(queryPlan.query);
                }
                catch (e) {
                    queryPlan.query = null;
                }
            }

            // Update the value.
            //如果值为null，设置为空字符串
            filter.setValue(queryPlan.query || '');

            // If we are not caching previous queries, or the filter has changed in any way
            // (value, or matching criteria etc), or the force flag is different, then we
            // must re-filter. Otherwise, we just drop through to expand.
            if (!me.getQueryCaching() || filter.generation !== lastQuery.filterGeneration ||
                query.force) {
                // If there is a query string to filter against, enable the filter now and prime
                // its value.
                // Filtering will occur when the store's FilterCollection broadcasts its
                // endUpdate signal.
                if (Ext.isEmpty(queryPlan.query)) {
                    filter.setDisabled(true);
                }
                else {
                    filter.setDisabled(false);

                    // If we are doing remote filtering, set a flag to
                    // indicate to onStoreLoad that the load is the result of filering.
                    me.isFiltering = !isLocal;
                }

                me.lastQuery = queryPlan;

                // Firing the ensUpdate event will cause the store to refilter if local filtering
                // or reload starting at page 1 if remote.
                filters.beginUpdate();
                filters.endUpdate();

                // If we are doing local filtering, the upstream store MUST be loaded.
                // Now we use a ChainedStore we must do this. In previous versions
                // simply adding a filter caused automatic store load.
                if (store.isChainedStore) {
                    source = store.getSource();

                    if (!source.isLoaded() && !source.hasPendingLoad()) {
                        source.load();
                    }
                }
            }

            if (me.getTypeAhead()) {
                me.doTypeAhead(queryPlan);
            }

            // If the query result is non-zero length, or there is empty text to display
            // we must expand.
            // Note that edge pickers do not have an emptyText config.
            picker = me.getPicker();

            // If it's a remote store, we must expand now, so that the picker will show its
            // loading mask to show that some activity is happening.
            if (!isLocal || store.getCount() || (picker.getEmptyText && picker.getEmptyText())) {
                me.expand();

                // If the use is querying by a value, and it's a local filter, then
                // set the location immediately. If it's going to be a remote filter,
                // then onStoreLoad will set the location after the
                if (queryPlan.query && isLocal) {
                    me.setPickerLocation();
                }

                return true;
            }

            // The result of the filtering is no records and there's no emptyText...
            // if it's a local query, hide the picker. If it's remote, we do not
            // know the result size yet, so the loading mask must stay visible.
            me.collapse();
        }

        return false;
    },

    beforeFilter: function(queryPlan) {
        var me = this,
            query = queryPlan.query,
            len;
        //如果查询值是最后一次的查询值，不执行查询
        // if(me.lastQuery.query === query) {
        //     queryPlan.cancel = true;
        //     return queryPlan;
        // };
        // Allow beforequery event to veto by returning false
        if (me.fireEvent('beforequery', queryPlan) === false) {
            queryPlan.cancel = true;
        }
        // Allow beforequery event to veto by returning setting the cancel flag
        else if (!queryPlan.cancel) {
            len = query && query.length;

            //是否带中文字符，如果是，执行查询
            let hasUnicode = escape(query).includes("%u");
            // If the minChars threshold has not been met, and we're not forcing a query, cancel
            // the query

            if (!queryPlan.force && len && len < me._getMinChars() &&  !hasUnicode) {
                queryPlan.cancel = true;
            }
        }

        return queryPlan;
    },

    /**
     * @private
     * Show the dropdown based upon triggerAction and allQuery
     */
    onExpandTap: function() {
        var me = this,
            triggerAction = me.getTriggerAction();

        // TODO: Keyboard operation
        // Alt-Down arrow opens the picker but does not select items:
        // http://www.w3.org/TR/wai-aria-practices/#combobox

        if (me.expanded) {
            // Check the expended time to check that we are not being called in the immediate
            // aftermath of an expand. The reason being that expandTrigger does focusOnTap
            // and Picker fields expand on focus if the focus happened via touch.
            // But then, when the expandTrigger calls its handler, we get here immediately
            // and do a collapse.
            if (Ext.now() - me.expanded > 100) {
                me.collapse();
            }
        }
        else if (!me.getReadOnly() && !me.getDisabled()) {
            if(me.lastQuery.query === me.inputElement.dom.value){
                me.expand();
                return;
            }
            if (triggerAction === 'all') {
                me.doFilter({
                    query: me.getAllQuery(),
                    force: true // overrides the minChars test
                });
            }
            else if (triggerAction === 'last') {
                me.doFilter({
                    query: me.lastQuery.query,
                    force: true // overrides the minChars test
                });
            }
            else {
                me.doFilter({
                    query: me.inputElement.dom.value
                });
            }
        }
    },


    updateSelection: function(selection, oldSelection) {
        var me = this,
            isNull = selection == null,
            multiSelect = me.getMultiSelect(),
            valueCollection = me.getValueCollection(),
            valueField = me.getValueField(),
            oldValue = me._value,
            newValue = null,
            picker, spliceArgs;

        if (me._ignoreSelection || me.destroyed || me.destroying) {
            return;
        }

        // If we are updating the selection becuse of a mutation fire from the valueCollection
        // then we do not have to update the valueCollection
        if (!me.processingCollectionMutation) {
            if (isNull || (oldSelection && selection.length < oldSelection.length) ||
                !valueCollection.containsAll(selection)) {
                spliceArgs = [0, valueCollection.getCount()];

                // If the selection isNull, do not append the final "toAdd" argument.
                // That would attempt to add null which would throw an error.
                if (!isNull) {
                    spliceArgs.push(selection);
                }

                // Replace all valueCollection content with the new selection.
                // We are an observer of the valueCollection.
                //
                // This will feed through to our onCollectionRemove, which will only
                // push through to the selection property if there's no upcoming add.
                //
                // If there's an add, then our onCollectionAdd will be called
                // which will push the valueCollection's data through to
                // our selection property.
                valueCollection.splice.apply(valueCollection, spliceArgs);

                // In case splice user event handler destroyed us.
                if (me.destroyed) {
                    return;
                }
            }
        }

        if (selection) {
            if (valueField) {
                // Multi select. Pull an array or the valueField out.
                if (multiSelect) {
                    newValue = valueCollection.collect(valueField, 'data');

                    //<debug>
                    if (newValue.length !== valueCollection.length) {
                        Ext.raise('The valueField of a combobox must be unique');
                    }
                    //</debug>
                }
                // Single select. Pull the valueField out.
                else {
                    newValue = selection.get(valueField);
                }

                me.setValue(newValue);
            }

            // Allow selection to be vetoed, in which case fall back to oldValue
            if (me.fireEvent('select', me, selection) === false) {
                me.setValue(oldValue);
                me._selection = oldSelection;
            }
        }
        else {
            me.clearValue();
        }

        // Event handlers may destroy this component
        if (me.destroyed) {
            return;
        }

        // Only get the picker if it has been created.
        picker = me.getConfig('picker', false, true);

        // If the picker has been created, either collapse it,
        // or scroll to the latest selection.
        if (picker && picker.isVisible()) {
            if (!multiSelect || me.getCollapseOnSelect() || !me.getStore().getCount()) {
                // The setter's equality test cannot tell if the single selected record
                // is in effect unchanged. We only need to collapse if a *new* value has
                // been set, that is, the user has selected a record with a different id.
                // We can get here when the selection is refreshed due to record add/remove
                // when the record *instance* is renewed, but it is the same id.
                // In that case, all we need is a refresh of the data in case the record's
                // data payload changed.
                //
                // If unchanged, it's possible that other data in the record may have changed
                // which could affect the BoundList, so refresh that
                if (!multiSelect && selection && oldSelection && selection.id === oldSelection.id) {
                    picker.refresh();
                }
                else {
                    // If it's a single select, dynamically created record, this is due
                    // to typing, so do not collapse.
                    //取消了以下这段
                    // if (!(selection && selection.isEntered)) {
                    //     me.collapse();
                    // }
                }
            }
        }
    },

    createSelectionRecord: function(data) {
        var Model = this.getStore().getModel();
        let idField = Model.fields.find(field=>field.identifier);
        //如果模型id字段实际数据字段id不同，将id设置为null
        if(idField && idField.type !== typeof(data.id)){
            data.id = null;
        }
        return new Model(data);
    },
   

})
