Ext.define('Common.data.store.Details',{
    extend: 'Ext.data.Store',
    alias: 'store.details',

    requires:[
        'Common.data.model.Detail'
    ],

    model: 'Common.data.model.Detail',
    autoLoad: false,
    pageSize: 0
})