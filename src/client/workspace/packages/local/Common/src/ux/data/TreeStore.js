Ext.define('Common.ux.data.TreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.uxformattreestore',

    mixins:[
        'Common.mixin.data.Model',
        'Common.mixin.data.Proxy'
    ],

    rootVisible: false,
    remoteFilter: false,
    proxy: 'format'

});
