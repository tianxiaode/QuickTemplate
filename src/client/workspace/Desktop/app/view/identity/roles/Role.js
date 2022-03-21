Ext.define('Desktop.view.identity.roles.Role', {
    extend: 'Common.ux.panel.Content',
    xtype : 'desktop-roleview', 

    requires:[
        'Common.ux.crud.Grid',
        'Common.view.identity.roles.Model',
    ],


    items: [
        {
            xtype: 'uxcrudgrid',
            viewModel: 'rolemodel',
            hasPaging: false,
            controller: 'desktop-rolecontroller',
            doubleTapToEdit: true,
            flex:1,
            columns:[
                { 
                    dataIndex: 'displayName', width: 200,
                    autoText: false, langText: 'DisplayName:RoleName',
                    renderer: Format.girdHighlight,
                    cell:{  encodeHtml: false,}
                 },
                 {
                    dataIndex: 'displayPermissions', flex: 1,
                    autoText: false, langText: 'Permissions'
                 },
                 { xtype: 'checkcolumn', dataIndex: 'isStatic', width: 80 },
                { xtype: 'checkcolumn', dataIndex: 'isDefault', width: 80, listeners: { checkchange: 'onColumnCheckChange' } } ,
                { xtype: 'checkcolumn', dataIndex: 'isPublic', width: 80, listeners: { checkchange: 'onColumnCheckChange' } },
                {
                    autoText: false,
                    text: '...',
                    width: 60,
                    sortable: false,
                    menu: false,
                    align: 'center',
                    cell:{
                        tools:{
                            translation:{
                                iconCls: 'x-fa fa-globe text-primary',
                                handler: 'onMultilingual',
                                langTooltip: 'Display:Translation',
                            }
                        }
                    }        
                }
            ]
        }
    ]
});