Ext.define('Common.ux.panel.Content',{
    extend: 'Ext.Container',
    xtype: 'uxcontentpanel',

    requires:[
        'Common.ux.toolbar.Action',
        'Common.ux.toolbar.Paging',
        'Common.ux.grid.Grid',
        'Common.ux.grid.Tree',
        'Common.ux.dataview.List'
    ],

    layout: 'vbox',
    weighted: true,
    flex: 1,
    userCls: 'bg-color-white',
    includeResource: true,

    config:{
        actionToolbar:{
            xtype: 'uxactiontoolbar',
            weight: 100,
        },
        list:{
            xtype: 'uxgrid',            
            weight: 200,
            flex: 1,
        },
        paging: null
    },

    createActionToolbar(config){
        return Ext.apply({ownerCmp: this}, config);
    },

    applyActionToolbar(config, old){
        return Ext.updateWidget(old, config,this, 'createActionToolbar');
    },

    // updateActionToolbar(config){
    //     config && this.add(config);
    // },

    createList(config){
        return Ext.apply({            
            ownerCmp: this,
            listeners:{
                storechange: this.onStoreChange
            }
        }, config);
    },

    applyList(config, old){
        return Ext.updateWidget(old, config,this, 'createList');
    },

    // updateList(config){
    //     config && this.add(config);
    // },

    createPaging(config){
        return Ext.apply({
            xtype: 'uxpagingtoolbar',
            ownerCmp: this
        }, config);
    },

    applyPaging(config, old){
        return Ext.updateWidget(old, config,this, 'createPaging');
    },

    // updatePaging(config){
    //     config && this.add(config);
    // },

    initialize(){
        let me = this,
            list = me.getList(),
            store = list.getStore(),
            resourceName = store.getResourceName(),
            entityName = store.getEntityName(),
            toolbar = me.getActionToolbar(),
            paging = me.getPaging();
        me.callParent();
        me.setEntityName(entityName);
        me.setResourceName(resourceName);
        me.setPermissionGroup(resourceName);
        toolbar && me.add(toolbar);
        me.add(list);
        paging && me.add(paging);
    },

    doDestroy(){
        this.destroyMembers('actionToolbar', 'grid', 'paging');
    },

    onStoreChange(store, old){}
})