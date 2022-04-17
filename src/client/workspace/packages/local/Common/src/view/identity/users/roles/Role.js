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


    grid:{
        xtype: 'uxcrudgrid',
        flex:1,
        columns:[
            { 
                dataIndex: 'name', flex: 1,
                autoText: false, langText: 'DisplayName:RoleName',
                cell:{  encodeHtml: false,},
                tpl: `{name:this.listHighlight(values,'name')} {translation:translation('name','- ')}`
            },
            { 
                xtype: 'uxcheckchangecolumn', dataIndex: 'isSelected', 
                sortable: false, 
                autoText: false, langText: 'SelectedOrNot:Selected',
            }
        ],
        bind: {store: '{userRoles}'}
    }
})