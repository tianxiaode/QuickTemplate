Ext.define('Common.data.store.Districts',{
    extend: 'Ext.data.Store',
    alias: 'store.districts',
    //storeId: 'ExtraFieldStore',

    requires:[
        'Common.data.model.District'
    ],

    model: 'Common.data.model.District',
    autoLoad: false,
    pageSize: 0,
    sorters: [{
        property: 'text',
        direction: ''
    }]

})