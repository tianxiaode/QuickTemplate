Ext.define('Desktop.view.infrastructures.Infrastructure', {
    extend: 'Common.ux.navigation.Panel',
    xtype : 'desktop-infrastructureview', 
    
    requires:[
        'Common.view.infrastructures.districts.District',
    ],


    navigation:{
        langTitle: 'Infrastructures',
        resourceName: 'Infrastructures',
        data:[
            { 
                iconCls: 'x-fa fa-map-marker-alt', langText: 'Districts',  resourceName: 'Infrastructures',
                viewType: 'districtview', permission: 'Infrastructures.Districts.ManagePermissions' 
            },
        ]
    }

});