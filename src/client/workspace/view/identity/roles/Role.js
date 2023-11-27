Ext.define('Desktop.view.identity.roles.Role', {
    extend: 'Ext.Panel',
    xtype : 'desktop-roleview', 

    requires:[
        // 'Common.view.identity.roles.Model',
        // 'Common.view.identity.roles.Controller',
        // 'Common.ux.grid.column.Action',
    ],


    controller: 'rolecontroller',
    viewModel: 'rolemodel',
    resourceName: 'AbpIdentity',
    entityName: 'Role',

    grid:{
        doubleTapToEdit: true,
        flex:1,
        columns:[
            { 
                dataIndex: 'name', width: 200,
                cell:{  encodeHtml: false,},
                renderer: Format.gridHighlight
            },
            {
            dataIndex: 'displayPermissions', flex: 1,
            autoText: false, langText: 'Permissions',
            },
            { xtype: 'uxcheckchangecolumn', dataIndex: 'isDefault'} ,
            { xtype: 'uxcheckchangecolumn', dataIndex: 'isPublic'},
            {
                xtype: 'uxactioncolumn',
            }
        ]
    }
});