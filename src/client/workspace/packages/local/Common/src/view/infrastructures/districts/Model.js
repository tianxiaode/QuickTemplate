Ext.define('Common.view.infrastructures.districts.Model',{
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.districtmodel',

    requires:[
        'Common.data.store.infrastructures.Districts',
        'Common.data.store.TreeSearches',
    ],
    
    stores: {
        mainStore: {
            type: 'districts'
        },
        searchStore:{
            type: 'treesearches'
        }
    },

})