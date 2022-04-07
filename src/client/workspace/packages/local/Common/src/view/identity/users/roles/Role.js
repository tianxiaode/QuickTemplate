Ext.define('Common.view.identity.users.roles.Role',{
    extend: 'Common.ux.crud.container.Base',
    xtype: 'userroleview',
    
    mixins:[
        'Common.mixin.component.SelectedOrNot',
    ],

    requires:[
        'Common.view.identity.users.roles.RoleController',
    ],

    hasCreate: false,
    hasUpdate: false,
    hasDelete: false,

    controller: 'common-userrolecontroller',
    includeResource: false,    

    items:[
        {
            xtype: 'uxcrudgrid',
            flex:1,
            columns:[
                { 
                    dataIndex: 'name', flex: 1,
                    autoText: false, langText: 'DisplayName:RoleName',
                    cell:{  encodeHtml: false,},
                    tpl: `{name:this.listHighlight(values,'name')} {translation:translation('name','- ')}`
                },
                { xtype: 'checkcolumn', dataIndex: 'isSelected', width: 80, listeners: { checkchange: 'onColumnCheckChange' } } ,
            ],
            bind: {store: '{userRoles}'}
        }
    ]
})