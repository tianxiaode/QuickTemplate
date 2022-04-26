Ext.define('Common.data.store.infrastructures.Districts',{
    extend: 'Common.ux.data.TreeStore',
    alias: 'store.districts',

    requires:[
        'Common.data.model.infrastructures.District'
    ],

    model: 'Common.data.model.infrastructures.District',
    pageSize: 0,
    sorters:'displayName',
})