Ext.define('Common.view.identity.user.Form',{
    extend: 'Common.ux.form.Base',
    xtype: 'userform',

    items:[
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
            layout: 'vbox',
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
        }
    ]
})