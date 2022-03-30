Ext.define('Desktop.view.infrastructures.Infrastructure', {
    extend: 'Common.ux.panel.Content',
    xtype : 'desktop-infrastructureview', 
    
    requires:[
        'Common.ux.navigation.View',
    ],


    items: [
        {
            xtype: 'uxnavigationview',
            flex:1,
            navigation:{
                title: 'Infrastructure',
                data:[
                    { 
                        iconCls: 'x-fa fa-map-marker-alt', text: 'Districts', 
                        resourceName: 'Infrastructures', viewType: 'districtgrid',
                        permission: 'Infrastructures.Districts.ManagePermissions' 
                    },
                ]
            }
        } ,
    ],

});