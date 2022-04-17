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
    resourceName: 'AbpIdentity',
    entityName: 'Role',

    grid:{
        doubleTapToEdit: true,
        flex:1,
        columns:[
            { 
                dataIndex: 'name', width: 200,
                autoText: false, langText: 'DisplayName:RoleName',
                cell:{  encodeHtml: false,},
                tpl: `{name:this.listHighlight(values,'name')} {translation:translation('name','- ')}`
                },
                {
                dataIndex: 'displayPermissions', flex: 1,
                autoText: false, langText: 'Permissions',
                },
            { xtype: 'uxcheckchangecolumn', dataIndex: 'isDefault'} ,
            { xtype: 'uxcheckchangecolumn', dataIndex: 'isPublic'},
            {
                autoText: false,
                text: '...',
                width: 60,
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
});