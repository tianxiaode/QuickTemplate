Ext.define('Common.ux.panel.content.Base', {
    extend: 'Ext.Container',
    xtype: 'uxcontentpanel',

    requires:[
        'Common.ux.toolbar.crud.Base',
        'Common.ux.toolbar.crud.Multiline',

    ],

    /**
     * 注意：Store和Selectable必须在Button和CountMessage之前
     * 不然这两个类中after中定义的方法因为找不到父类方法而报错（callParent错误）
     */
    mixins:[
        'Common.mixin.Permission',
        'Common.mixin.Normalize',
        'Common.mixin.data.Store',
        'Common.mixin.crud.Selectable',
        'Common.mixin.crud.Button',
        'Common.mixin.crud.ButtonAction',
        'Common.mixin.crud.Batch',
        'Common.mixin.crud.CountMessage',
        'Common.mixin.crud.ChildTap',
        'Common.mixin.crud.ChildLongPress',
        'Common.mixin.crud.DoubleTapToEdit',
        'Common.mixin.crud.Multilingual',
        'Common.mixin.crud.ToolAction',        
        'Common.mixin.Searchable',
        'Common.mixin.plugin.CellEditing',
        'Common.mixin.Toolbar',
        'Common.mixin.List',
        'Common.mixin.Paging',
        'Common.mixin.crud.ShowPagingMenu'
    ],

    layout: 'vbox',
    weighted: true,
    flex: 1,
    userCls: 'bg-content',

    autoLoad: true,

    multilineToolbar: false,    

    config: {
        toolbar: { xtype: 'uxcrudtoolbar', weight: 100 },
        list: {
            xtype: 'uxgrid',
            weight: 200,
            flex: 1,
        }
    },


    updateList(config) {
        this.onStoreChange(config.getStore());
        config && this.add(config);
    },

    afterUpdatePagingMode(mode) {
        let me = this,
            grid = me.getList(),
            store = grid.getStore(),
            isHide = mode === 'toolbar',
            toolbar = me.getToolbar(),
            countMessage = toolbar.getCountMessage(),
            refreshButton = toolbar.getRefreshButton();
        countMessage && countMessage.setHidden(isHide);
        refreshButton && refreshButton.setHidden(isHide);

        if(isHide){
            store && me.getPaging().setStore(store);
        }
    },

    doDestroy() {
        this.destroyMembers('listPaging', 'toolbar', 'list', 'paging');
        this.callParent(arguments);
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
            
            me.initButtons(me.getToolbar(), me.getPermissions());

            
            me.setSearchFields(me.getToolbar().query('[isSearch]'));
            paging && paging.setStore(store);
            (autoLoad === 'search') && me.doSearch();
            (autoLoad === true) && me.onRefreshStore();
        }


    }
})