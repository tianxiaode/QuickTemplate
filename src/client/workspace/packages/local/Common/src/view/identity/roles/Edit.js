Ext.define('Common.view.identity.roles.Edit', {
    extend: 'Common.ux.crud.form.Form',
    xtype : 'roleeditview', 
    
    requires:[
        'Common.view.identity.roles.Permissions'
    ],


    items: [
        { xtype: 'hiddenfield', name: 'id'},
        { xtype: 'hiddenfield', name: 'concurrencyStamp'},
        { 
            xtype: 'textfield', name: 'name', maxLength: 256,
            reference: 'roleNameField',
            required: true, 
            autoLabel: false,
            langLabel: 'RoleName'
        },
        {
            xtype: 'containerfield',
            autoLabel: false,
            label: Ext.emptyString,
            layout: 'hbox',
            defaults:{
                value: true,
                inputValue: true,
                uncheckedValue: false,
                flex :1
            },
            defaultType: 'checkboxfield',
            items:[
                { name: 'isDefault'},
                { name: 'isPublic'},
            ]
        },
        {
            xtype: 'uxpermissionsfield',
            name: 'permissions',
            flex: 1
        },
    ]
});