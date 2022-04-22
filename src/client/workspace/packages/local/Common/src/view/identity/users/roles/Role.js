Ext.define('Common.view.identity.users.roles.Role',{
    extend: 'Common.ux.crud.container.Grid',
    xtype: 'userroleview',
    
    mixins:[
        'Common.mixin.component.SelectedOrNot',
        'Common.ux.grid.column.CheckChange',
    ],

    requires:[
        'Common.view.identity.users.roles.RoleController',
    ],

    hasCreate: false,
    hasUpdate: false,
    hasDelete: false,

    controller: 'common-userrolecontroller',
    responsive: 'more',

    grid:{
        flex:1,
        columns:[
            { 
                dataIndex: 'name', flex: 1,
                renderer: Format.gridHighlight,
                cell:{  encodeHtml: false,},
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