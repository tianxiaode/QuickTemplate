Ext.define('Common.view.identity.users.More',{
    extend: 'Common.ux.panel.More',
    xtype: 'usermoreview',

    requires:[
        'Common.view.identity.users.roles.Role',
        'Common.view.identity.users.MoreModel',
    ],

    viewModel: 'usermoremodel',
    hasBack: true,

    defaultTabs:[
        {
            langText: 'Roles',
            pageType: 'userroleview',
            pageItemId: 'roles',
        }
    ],

    switchTitle(me, record){
        let text = record ? record.get('userName') : I18N.get('None');
        me.setTitle(I18N.get('CurrentUser', me.resourceName) + ": " + text);
    }

})