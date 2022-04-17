Ext.define('Common.ux.crud.container.Tree',{
    extend: 'Common.ux.crud.container.Base',

    requires:[
        'Ext.grid.Tree'
    ],

    config:{
        tabBar:{
            xtype: ''
        },
        tree:{
            xtype: 'tree',
            isCrudList: true,
            autoLoad: false,
            scrollable: 'y',    
            bind:{ store: '{mainStore}'},
        },
        searchList:{
            xtype: 'grid',
            isSearchList: true,
            hidden: true,
            bind: {store: '{searchStore}'},
            columns:[]
        }
    }

})