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
    userCls: 'bg-content',
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
        return Ext.apply({

            ownerCmp: this
        }, config);
    },

    applyActionToolbar(config, old){
        return Ext.updateWidget(old, config,this, 'createActionToolbar');
    },

    updateActionToolbar(config){
        config && this.add(config);
    },

    createList(config){
        let me = this;
        return Ext.apply({            
            ownerCmp: me,
            listeners:{
                select: me.onListSelect,
                deselect: me.onListDeselect,
                scope: me
            }
        }, config);
    },

    applyList(config, old){
        return Ext.updateWidget(old, config,this, 'createList');
    },

    updateList(config){
        this.onStoreChange(config.getStore());
        config && this.add(config);
    },

    createPaging(config){
        return Ext.apply({
            xtype: 'uxpagingtoolbar',
            ownerCmp: this
        }, config);
    },

    applyPaging(config, old){
        return Ext.updateWidget(old, config,this, 'createPaging');
    },

    updatePaging(config){
        config && this.add(config);
    },

    doDestroy(){
        let me = this;
        me.setStore(null);
        me.destroyMembers('actionToolbar', 'grid', 'paging');
    },

    privates:{
        onStoreChange(store){
            let me = this,
                toolbar = me.getActionToolbar(),
                resourceName = store.getResourceName(),
                entityName = store.getEntityName();
            me.setResourceName(resourceName);
            me.setEntityName(entityName);
            me.setPermissionGroup(resourceName);
            toolbar.initButtons(me.permissions);
            Logger.debug(this.onStoreChange, me.getPermissionGroup(), me.permissions);
        },

        onListSelect(){

        },

        onListDeselect(){

        }
    }

})