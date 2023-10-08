Ext.define('Common.core.data.Store', {
    extend: 'Ext.data.Store',
    alias: 'store.formatstore',

    mixins:[
        'Common.core.mixin.data.Store'
    ],

    remoteSort: true,
    remoteFilter: true,
    filterValue: null,
    pageSize: 25,

    proxy: 'format'


});
