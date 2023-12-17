Ext.define('Desktop.view.dashboard.Dashboard',{
    extend: 'Common.ux.panel.Content',
    xtype: 'dashboardview',

    requires:[
        'Common.data.store.menumanagement.Menus'
    ],

    list:{
        store:{
            type: 'menus'
        },
        columns:[
            { 
                dataIndex: 'displayName', flex: 1
            },
            {
                dataIndex: 'groupName', flex: 1
            },
            { 
                dataIndex: 'router', flex: 1
            },
            {
                dataIndex: 'icon'
            },
            { xtype: 'uxcheckchangecolumn', dataIndex: 'isSelectable'} ,
            { xtype: 'uxcheckchangecolumn', dataIndex: 'isDisabled'},
            {
                xtype: 'uxactioncolumn'
            }
        ]
    }


});