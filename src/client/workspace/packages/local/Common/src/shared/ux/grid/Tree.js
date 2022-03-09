Ext.define('Common.shared.ux.grid.Tree',{
    extend: 'Ext.grid.Tree',
    xtype: 'uxtree',

    autoLoad: false,
    scrollable: 'y',    
    hideHeaders: true,
    columns:[
        { 
            xtype: 'treecolumn',
            autoText: false,
            dataIndex: 'displayName', 
            flex: 1
         },
    ],
    bind:{ store: '{treeMainStore}'},

});