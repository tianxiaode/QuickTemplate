Ext.define('Common.view.infrastructures.districts.Model',{
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.districtmodel',

    requires:[
        'Common.data.store.infrastructures.Districts'
    ],
    
    stores: {
        mainStore: {
            type: 'districts'
        },
    },

})