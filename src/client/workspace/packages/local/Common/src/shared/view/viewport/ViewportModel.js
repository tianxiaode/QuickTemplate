Ext.define('Common.shared.view.viewport.ViewportModel',{
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.shared-viewport',

    requires:[
        'Common.data.store.Enums'
    ],

    stores:{
        organizationunitofaccount:{
            type: 'organizationunitofaccount'
        },
    }

})