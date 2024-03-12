Ext.define('Common.view.identity.user.Form',{
    extend: 'Common.ux.form.Base',
    xtype: 'userform',

    mixins:[
        'Common.mixin.field.NewPassword',
        'Common.mixin.field.Email'
    ],

    newPasswordField:{ weight: 500},
    confirmPasswordField:{ weight: 600, autoLabel: true},
    emailField:{ weight: 150, autoLabel: true, required: true, autoComplete: false},
    cols: 2,

    items:[
        { 
            xtype: 'textfield', name: 'userName', maxLength: 256,
            reference: 'userNameField',
            autoComplete: false,
            required: true, 
            weight: 100
        },
        { 
            xtype: 'textfield', name: 'name', maxLength: 64,
            weight: 200

        },
        { 
            xtype: 'textfield', name: 'surname', maxLength: 64,
            weight: 300
        },
        { 
            xtype: 'textfield', name: 'phoneNumber', maxLength: 16,
            weight: 400, required: true
        },
        {
            xtype: 'containerfield',
            autoLabel: false,
            label: Ext.emptyString,
            userCls: 'cols-1',
            bodyCls: 'clear-flex-wrap-item',
            layout: 'vbox',
            weight: 700,
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
    ],

    onAfterInitForm(){
        let me = this;
        me.getNewPasswordField().setRequired(!me.isEdit);
        me.getConfirmPasswordField().setRequired(!me.isEdit);
        me.clearErrors();
    }


})