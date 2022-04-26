Ext.define('Common.data.store.Multilingual',{
    extend: 'Ext.data.Store',
    alias: 'store.multilingual',

    requires:[
        'Common.data.model.Multilingual'
    ],

    model: 'Common.data.model.Multilingual',
    autoLoad: false,
    pageSize: 0,
    groupField: 'languageText',
    sorters: 'order'
})