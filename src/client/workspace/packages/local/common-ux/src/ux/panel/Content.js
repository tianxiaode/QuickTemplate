Ext.define('Common.ux.panel.Content',{
    extend: 'Ext.Container',
    xtype: 'uxcontentpanel',

    requires:[
        'Common.ux.toolbar.Action',
        'Common.ux.toolbar.Paging',
        'Common.ux.grid.Grid'
    ],

    layout: 'vbox',
    weighted: true,
    flex: 1,
    userCls: 'bg-color-white',

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

    updateActionToolbar(config){
        config && this.add(config);
    },

    createList(config){
        return Ext.apply({            
            ownerCmp: this,
            listeners:{
                storechange: 'onStoreChange'
            }
        }, config);
    },

    applyList(config, old){
        return Ext.updateWidget(old, config,this, 'createList');
    },

    updateList(config){
        Logger.debug(this.updateList, Ext.clone(config))
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
        this.destroyMembers('actionToolbar', 'grid', 'paging');
    }
})