Ext.define('Common.data.store.NavigationTrees', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.navigationtrees',

    autoLoad: false,
    root: {
        id: 1,
        expanded: true,
    },

    fields: [
        { name: 'id', type: 'int' },
        //{ name: 'text', type: 'string' },
        { name: 'iconCls', type: 'string' },
        { name: 'viewType', type: 'string' },
        { name: 'parentId', type: 'int' },
        //{ name: 'children' },
        //{ name: 'selectable', type: 'boolean' },
        { name: 'isActive', type: 'boolean' },
        //{ name: 'leaf', type: 'boolean' },

    ],    
    // proxy: {
    //     type: 'format',
    //     url: URI.get('Configuration', 'menus')
    // },

});
