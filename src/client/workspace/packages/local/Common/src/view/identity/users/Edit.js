Ext.define('Common.view.identity.users.Edit', {
    extend: 'Common.ux.crud.form.Form',
    xtype : 'usereditview', 
    
    mixins:[
        'Common.mixin.component.field.Email',
        'Common.mixin.component.field.NewPassword',
        'Common.view.identity.users.EditController'
    ],

    newPasswordFieldIndex: 5,
    controller: 'usereditcontroller',

    items: [
        { 
            xtype: 'textfield', name: 'userName', maxLength: 256,
            reference: 'userNameField',
            required: true, 
        },
        { 
            xtype: 'textfield', name: 'name', maxLength: 64,
        },
        { 
            xtype: 'textfield', name: 'surname', maxLength: 64,
        },
        { 
            xtype: 'textfield', name: 'phoneNumber', maxLength: 16,
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
                { name: 'isActive'},
                { name: 'lockoutEnabled'},
            ]
        },
    ]
});