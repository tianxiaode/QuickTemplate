Ext.define('Desktop.view.dashboard.Dashboard',{
    extend: 'Common.ux.panel.Content',
    xtype: 'dashboardview',
    
    requires:[
        'Common.view.identity.roles.Permissions'
    ],

    layout: 'vbox',

    items:[
        {
            xtype: 'component',
            html: 'Dashboard'
        },
        {
            xtype: 'uxpermissionsfield',
            value:  [`AbpIdentity.Roles.Create`, `SettingManagement.Emailing`]
        },
        {
            xtype: 'button',
            text: 'aaa',
            handler(){
                let c = this.up().down('uxpermissionsfield');
                c.setValue( [`AbpIdentity.Roles.Update`, `AbpIdentity.Users.Update`])
            }
        }
    ]
});