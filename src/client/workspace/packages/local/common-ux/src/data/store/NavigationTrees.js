Ext.define('Common.data.store.NavigationTrees', {
    extend: 'Common.core.data.TreeStore',
    alias: 'store.navigationtrees',

    requires:[
        'Common.data.model.menumanagement.Menu'
    ],

    autoLoad: false,
    remoteRoot: false,
    model: 'Common.data.model.menumanagement.Menu'

});
