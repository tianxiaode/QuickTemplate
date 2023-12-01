Ext.define('Common.data.store.NavigationTrees', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.navigationtrees',

    autoLoad: false,
    root: {
        id: 'd4548025-2425-4d53-a245-ac9a6cfb851b',
        expanded: true,
    },

    fields: [
        { name: 'iconCls', type: 'string' },
        { name: 'viewType', type: 'string' },
        { name: 'isActive', type: 'boolean' },

    ],    

});
