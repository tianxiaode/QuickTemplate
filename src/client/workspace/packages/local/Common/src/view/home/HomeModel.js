Ext.define('Common.view.home.HomeModel',{
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.homemodel',

    requires:[
        'Common.data.store.organizationunits.OrganizationUnits'
    ],

    data: {
        currentView: null,
        userName: null,
        appTitle: '',
        unreadBadgeText: '',
        isAuthenticated: false
    },

    // stores:{
    //     organizationunits:{
    //         type: 'organizationunits',
    //         pageSize: 0,
    //         remoteFilter: false,
    //         remoteSort: false,
    //         entity:[ 'OrganizationUnit', 'By-User']
    //     },
    // }

})