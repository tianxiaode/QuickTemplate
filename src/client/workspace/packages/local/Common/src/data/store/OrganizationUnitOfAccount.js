Ext.define('Common.data.store.OrganizationUnitOfAccount',{
    extend: 'Ext.data.Store',
    alias: 'store.organizationunitofaccount',

    requires:[
        'Common.data.model.OrganizationUnit',
        'Common.shared.ux.data.proxy.Format',
    ],

    model: 'Common.data.model.OrganizationUnit',
    autoLoad: false,
    pageSize: 0,
    sorters: [{
        property: 'displayName',
        direction: ''
    }],
    proxy:{
        type: 'format',
        url: URI.get('account', 'organizations')
    }

})