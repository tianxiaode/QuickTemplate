Ext.define('Common.ux.data.Store', {
    extend: 'Ext.data.Store',
    alias: 'store.uxformatstore',

    mixins:[
        'Common.ux.data.mixin.Model',
        'Common.ux.data.mixin.Proxy'
    ],

    remoteSort: true,
    remoteFilter: true,
    filterValue: null,
    pageSize: 25,

    proxy: 'format',

});
