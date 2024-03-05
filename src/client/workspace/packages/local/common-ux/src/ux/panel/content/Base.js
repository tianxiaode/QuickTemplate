Ext.define('Common.ux.panel.content.Base', {
    extend: 'Ext.Container',
    xtype: 'uxcontentpanel',

    mixins:[
        'Common.mixin.Normalize',
        'Common.mixin.crud.Button',
        'Common.mixin.crud.ButtonAction',
        'Common.mixin.crud.Batch',
        'Common.mixin.crud.CountMessage',
        'Common.mixin.data.Store',
        'Common.mixin.crud.Selectable',
        'Common.mixin.crud.ChildTap',
        'Common.mixin.crud.ChildLongPress',
        'Common.mixin.crud.DoubleTapToEdit',
        'Common.mixin.Searchable',
        'Common.mixin.plugin.CellEditing',
        'Common.mixin.plugin.ListPaging',
        'Common.mixin.Toolbar',
        'Common.mixin.List',
        'Common.mixin.Paging',
    ],

    layout: 'vbox',
    weighted: true,
    flex: 1,
    includeResource: true,
    userCls: 'bg-content',

    autoLoad: true,

    cellEditing: {},

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

    listPaging: {},

    updateList(config) {
        this.onStoreChange(config.getStore());
        config && this.add(config);
    },

    updatePaging(config) {
        if(!config) return;
        let me = this,
            toolbar = me.getToolbar(),
            countMessage = toolbar.getCountMessage(),
            refreshButton = toolbar.getRefreshButton();
        countMessage && countMessage.setHidden(true);
        refreshButton && refreshButton.setHidden(true);
        me.setListPaging(null);
        me.add(config);
    },

    doDestroy() {},

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