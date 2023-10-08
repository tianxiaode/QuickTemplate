Ext.define('Common.core.data.TreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.formattreestore',

    mixins:[
        'Common.core.mixin.data.Store'
    ],

    rootVisible: false,
    remoteFilter: false,
    proxy: 'format'

});
