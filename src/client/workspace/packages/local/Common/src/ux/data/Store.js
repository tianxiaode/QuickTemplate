Ext.define('Common.ux.data.Store', {
    extend: 'Ext.data.Store',
    alias: 'store.uxformatstore',

    mixins:[
        'Common.mixin.data.Model',
        'Common.mixin.data.Proxy'
    ],

    remoteSort: true,
    remoteFilter: true,
    filterValue: null,
    pageSize: 25,

    proxy: 'format'


});
