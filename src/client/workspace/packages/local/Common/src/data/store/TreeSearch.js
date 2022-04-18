Ext.define('Common.data.store.TreeSearches',{
    extend: 'Common.ux.data.Store',
    alias: 'store.treesearches',

    requires:[
        'Common.data.model.TreeBase',
    ],

    model: 'Common.data.model.TreeBase',
    autoLoad: false,
    pageSize: 0,
})