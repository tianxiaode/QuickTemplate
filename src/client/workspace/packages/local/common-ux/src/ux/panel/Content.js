Ext.define('Common.ux.panel.Content', {
    extend: 'Ext.Container',
    xtype: 'uxcontentpanel',

    requires: [
        'Common.ux.toolbar.Action',
        'Common.ux.toolbar.Paging',
        'Common.core.util.Format',
        'Common.ux.grid.Grid',
        'Common.ux.grid.Tree',
        'Common.ux.dataview.List'
    ],

    mixins:[
        'Common.mixin.crud.Button',
        'Common.mixin.crud.ButtonAction',
        'Common.mixin.crud.Batch',
        'Common.mixin.crud.CountMessage',
        'Common.mixin.data.Store',
        'Common.mixin.crud.Selectable',
        'Common.mixin.Searchable',
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
        return Ext.apply({ ownerCmp: this }, config);
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

    doDestroy() {
        let me = this;
        me.buttons = null;
        me.searchFields = null;
        me.destroyMembers('actionToolbar', 'grid', 'paging');
    },

    privates: {       

        getCountMessage(){
            let toolbar = this.getToolbar();
            return toolbar && toolbar.getCountMessage();
        },

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
            me.initButtons(me.getToolbar(), me.permissions);
            me.setSearchFields(me.getToolbar().query('[isSearch]'));
            paging && paging.setStore(store);
            (autoLoad === 'search') && me.doSearch();
            (autoLoad === true) && me.onRefreshStore();
        }


    }
})