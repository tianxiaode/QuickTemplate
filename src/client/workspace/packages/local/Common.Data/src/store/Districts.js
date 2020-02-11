Ext.define('Common.Data.store.Districts',{
    extend: 'Ext.data.Store',
    alias: 'store.districts',
    //storeId: 'ExtraFieldStore',

    requires:[
        'Common.Data.model.District'
    ],

    model: 'Common.Data.model.District',
    autoLoad: false,
    pageSize: 0,
    sorters: [{
        property: 'text',
        direction: ''
    }]

})