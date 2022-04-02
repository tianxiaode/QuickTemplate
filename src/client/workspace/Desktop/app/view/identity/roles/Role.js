Ext.define('Desktop.view.identity.roles.Role', {
    extend: 'Common.ux.crud.container.Base',
    xtype : 'desktop-roleview', 

    requires:[
        'Common.ux.crud.Grid',        
        'Common.view.identity.roles.Model',
        'Common.view.identity.roles.Controller',
    ],


    controller: 'rolecontroller',
    viewModel: 'rolemodel',

    items: [
        {
            xtype: 'uxcrudgrid',
            doubleTapToEdit: true,
            hasPaging: false,
            flex:1,
            columns:[
                { 
                    dataIndex: 'name', width: 200,
                    autoText: false, langText: 'DisplayName:RoleName',
                    renderer: Format.girdHighlight,
                    cell:{  encodeHtml: false,},
                    //tpl: `{name} - {displayName:this.listHighlight(values, 'DisplayName')}`
                 },
                 {
                    dataIndex: 'displayPermissions', flex: 1,
                    autoText: false, langText: 'Permissions'
                 },
                 //{ xtype: 'checkcolumn', dataIndex: 'isStatic', width: 80 },
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