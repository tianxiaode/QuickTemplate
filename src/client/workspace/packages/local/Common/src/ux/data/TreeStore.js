Ext.define('Common.ux.data.TreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.uxformattreestore',

    mixins:[
        'Common.ux.data.mixin.Model',
        'Common.ux.data.mixin.Proxy',
    ],

    rootVisible: false,
    remoteFilter: false,
    proxy: 'format',


});
