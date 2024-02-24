Ext.define('Common.ux.panel.Content', {
    extend: 'Ext.Container',
    xtype: 'uxcontentpanel',

    requires: [
        'Common.ux.toolbar.Action',
        'Common.ux.toolbar.Paging',
        'Common.ux.grid.Grid',
        'Common.ux.grid.Tree',
        'Common.ux.dataview.List'
    ],

    layout: 'vbox',
    weighted: true,
    flex: 1,
    includeResource: true,
    userCls: 'bg-content',

    autoLoad: true,

    config: {
        toolbar: {
            xtype: 'uxactiontoolbar',
            weight: 100,
        },
        list: {
            xtype: 'uxgrid',
            weight: 200,
            flex: 1,
        },
        paging: null
    },

    createToolbar(config) {
        return Ext.apply({ ownerCmp: this }, config);
    },

    applyToolbar(config, old) {
        return Ext.updateWidget(old, config, this, 'createToolbar');
    },

    updateToolbar(config) {
        config && this.add(config);
    },

    createList(config) {
        let me = this;
        return Ext.apply({
            ownerCmp: me,
            listeners: {
                select: me.onListSelect,
                deselect: me.onListDeselect,
                scope: me
            }
        }, config);
    },

    applyList(config, old) {
        return Ext.updateWidget(old, config, this, 'createList');
    },

    updateList(config) {
        this.onStoreChange(config.getStore());
        config && this.add(config);
    },

    createPaging(config) {
        return Ext.apply({
            xtype: 'uxpagingtoolbar',
            weight: 300,
            ownerCmp: this
        }, config);
    },

    applyPaging(config, old) {
        return Ext.updateWidget(old, config, this, 'createPaging');
    },

    updatePaging(config) {
        if(!config) return;
        let me = this,
            toolbar = me.getToolbar(),
            countMessage = toolbar.getCountMessage(),
            refreshButton = toolbar.getRefreshButton();
        countMessage && countMessage.setHidden(true);
        refreshButton && refreshButton.setHidden(true);
        this.add(config);
    },

    onRefreshStore() {
        this.getStore().loadPage(1);
    },


    doDestroy() {
        let me = this;
        me.buttons = null;
        me.searchFields = null;
        me.destroyMembers('actionToolbar', 'grid', 'paging', 'searchTask');
    },

    privates: {

        getStore() {
            return this.getList().getStore();
        },

        onStoreChange(store) {
            let me = this,
                resourceName = store.getResourceName(),
                entityName = store.getEntityName(),
                autoLoad = me.autoLoad,
                paging = me.getPaging();
            me.setResourceName(resourceName);
            me.setEntityName(entityName);
            me.setPermissionGroup(resourceName);
            me.initButtons(me.permissions);
            me.initSearch();
            store.on('beforeload', me.onStoreBeforeLoad, me);
            store.on('load', me.onStoreLoad, me);
            paging && paging.setStore(store);
            (autoLoad === 'search') && me.doSearch();
            (autoLoad === true) && me.onRefreshStore();
            Logger.debug(this.onStoreChange, me.getPermissionGroup(), me.permissions);
        },

        onStoreLoad(store, records, successful, operation, eOpts) { 
            let me = this,
                countMessage = me.getToolbar().getCountMessage();
            countMessage && countMessage.setCount(store.getTotalCount());
        },


        /**
         * 存储加载前的操作
         */
        onStoreBeforeLoad(store) {
            if (Ext.isEmpty(store.getProxy().getUrl())) return false;
            this.getList().deselectAll();
            return true;
        },


        initButtons(permissions) {
            let me = this;
            me.setButtonHidden('create', !permissions.create);
            me.setButtonHidden('update', !permissions.update);
            me.setButtonHidden('delete', !permissions.delete);
        },

        getButtons() {
            let me = this,
                buttons = me.buttons;
            if (!buttons) {
                buttons = me.getToolbar().query('[isCrud]');
                me.buttons = {};
                Ext.each(buttons, b => {
                    let name = b.crudName;
                    me.buttons[name] = b;
                    b.setHandler(me[`on${Ext.String.capitalize(name)}ButtonTap`].bind(me));
                })
            }
            Logger.debug(me.getButtons, me.buttons)
            return me.buttons;
        },

        /**
         * 获取按钮
         * @param {按钮的key} key 
         */
        getButton(key) {
            let buttons = this.getButtons();
            return buttons[key];
        },


        setButtonHidden(key, hidden) {
            let button = this.getButton(key);
            button && button.setHidden(hidden);
        },

        setButtonDisabled(key, disabled) {
            let button = this.getButton(key);
            button && button.setDisabled(disabled);
        },

        /**
         * 更新CRUD按钮状态
         */
        refresButtons() {
            let me = this,
                hasSelected = me.hasSelections(false),
                allowUpdate = me.allowUpdate(hasSelected),
                allowDelete = me.allowDelete(hasSelected);
            me.setButtonDisabled('update', !allowUpdate);
            me.setButtonDisabled('delete', !allowDelete);
        },

        allowUpdate(hasSelected) {
            return hasSelected;
        },

        allowDelete(hasSelected) {
            return hasSelected;
        },

        hasSelections(alert){
            let result = this.getList().hasSelection();
            !result && alert && MsgBox.alert(null, I18N.get('NoSelection'));
            return result;
        },    

        initSearch() {
            let me = this,
                fields = me.getToolbar().query('[isSearch]');
            Ext.each(fields, f => {
                if (!f.autoSearch) return;
                f.on('change', me.onSearch, me);
            });
            me.searchFields = fields;
        },

        onListSelect() {
            this.refresButtons();
        },

        onListDeselect() {
            this.refresButtons();
        },

        onCreateButtonTap() {
            Logger.debug(this.onCreateButtonTap, arguments);
        },

        onBeforeCreateEntity() {

        },

        doCreateEntity() {

        },

        onUpdateButtonTap() {
            Logger.debug(this.onUpdateButtonTap, arguments);
        },

        onBeforeUpdateEntity() {

        },

        doUpdateEntity() {

        },

        onDeleteButtonTap() {
            Logger.debug(this.onDeleteButtonTap, arguments);
        },

        onBeforeDeleteEntity() {

        },

        doDeleteEntity() {

        },

        onRefreshButtonTap() {
            this.onRefreshStore();
        },

        onSearch() {
            let me = this,
                searchTask = me.searchTask;
            Logger.debug(this.onSearch);
            if (!searchTask) {
                searchTask = me.searchTask = new Ext.util.DelayedTask(me.doSearch, me);
            }
            searchTask.delay(500);
        },

        /**
         * 获取查询值
         */
        getSearchValues() {
            let me = this,
                fields = me.searchFields,
                values = {};
            Ext.each(fields, field => {
                let name = field.searchName;
                if (field.isButton) {
                    values[name] = field.getValue();
                    return;
                }
                if (!field.isValid()) return false;
                if (field.isCheckbox && !field.isChecked()) return;

                let value = field.getValue();
                if (Ext.isEmpty(value)) return;
                values[name] = value;

            })
            return values;

        },


        onBeforeSearch(values) {
            Logger.debug(this.onBeforeSearch, values);
        },

        doSearch() {
            let me = this,
                values = me.getSearchValues(),
                store = me.getStore();
            if (me.onBeforeSearch(values) === false) return;
            if (!Ext.isObject(values)) return;
            if (!store.getRemoteFilter()) {
                me.doLocalSearch(values);
                return;
            }
            store.setExtraParams(values, true);
            me.onRefreshStore();
            Logger.debug(this.doSearch, values);
        },

        /**
         * 执行本地查询
         * @param {查询值}} values 
         */
        doLocalSearch(values) {
            let me = this,
                store = me.getStore(),
                fields = store.localFilterFields,
                length = fields.length,
                filter = values.filter;
            store.filterValue = filter;
            store.clearFilter();
            if (Ext.isEmpty(filter)) return;
            if (length === 0) return;
            let fn = function (record) {
                let find = false;
                Ext.each(fields, field => {
                    let value = record.get(field);
                    if (Ext.isEmpty(value)) return;
                    find = value.toString().toLowerCase().includes(filter.toLowerCase());
                    if (find) return false;

                })
                return find;
            }
            store.filterBy(fn, me);
        },

    }

})