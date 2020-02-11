Ext.define('Common.Desktop.authentication.ResetPassword', {
    extend: 'Common.Desktop.authentication.LockingWindow',
    xtype: 'resetpassword',

    requires: [
        'Common.Desktop.authentication.Dialog',
        'Ext.field.Email',
        'Ext.field.Hidden',
        'Ext.Button',
        'Common.Desktop.authentication.ResetPasswordController',
    
    ],

    title: I18N.ResetPassword,
    defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well
    controller: 'authentication',

    items: [
        {
            xtype: 'authdialog',
            defaultButton : 'submitButton',
            bodyPadding: '20 20',
            header: false,
            width: 415,
            controller: 'resetpasswordcontroller',
            autoTabIndex:true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                autoLabel: false,
                margin : '5 0'
            },

            items: [
                {
                    xtype: 'label',
                    html: I18N.EnterNewPassword
                },
                { 
                    xtype: 'hiddenfield', 
                    name: 'c', 
                    readOnly: true,
                    required: true,
                    reference: 'ResetCode', 
                    maxLength:200,
                    height: 55,
                    placeholder: I18N.ResetCode,
                    // keyMapEnabled: true,
                    // keyMap:{
                    //     enter:{
                    //         handler: 'onNext'
                    //     }
                    // },
                    triggers:{
                        expane: {
                            iconCls: 'x-fa fa-key auth-trigger-icon',
                            width:50                            
                        }
                    }
                },
                // {
                //     xtype: 'hiddenfield',
                //     name: 'ticket',
                //     itemId: 'ticket'
                // },
                {
                    xtype: 'passwordfield',
                    height: 55,
                    placeholder: I18N.Password,
                    reference: 'Password',
                    name: 'password',
                    validators: 'password',
                    autoComplete: false,
                    required: true,
                    keyMapEnabled: true,
                    keyMap:{
                        enter:{
                            handler: 'onNext'
                        }
                    },
                    triggers:{
                        expane: {
                            iconCls: 'x-fa fa-lock auth-trigger-icon',
                            width:50                            
                        }
                    }
                },
                {
                    xtype: 'passwordfield',
                    height: 55,
                    placeholder: I18N.Password,
                    reference: 'ConfirmPassword',
                    name: 'confirmPassword',
                    autoComplete: false,
                    required: true,
                    validators: function(value){
                        var form = this.up('formpanel'),
                            p = form.down('passwordfield[name=password]'),
                            v = p.getValue();
                        if( p.getValue() !== value ) return I18N.PasswordNoEqual;
                        return true;
                    },
                    keyMapEnabled: true,
                    keyMap:{
                        enter:{
                            handler: 'onSave'
                        }
                    },
                    triggers:{
                        expane: {
                            iconCls: 'x-fa fa-lock auth-trigger-icon',
                            width:50                            
                        }
                    }
                },
                {
                    xtype: 'button',
                    reference: 'SubmitButton',
                    height:48,
                    style: 'font-size:16px;font-weight:300;',
                    ui: 'soft-light-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: I18N.OK,
                    formBind: true,
                    listeners: {
                        tap: 'onSave'
                    }
                },
                {
                    xtype: 'component',
                    html: `<div style="text-align:right"> 
                        <a href="#login" class="link-forgot-password">
                            ${I18N.Return}</a>
                        </div>`
                },
                {
                    xtype: 'component',
                    style: 'line-height: 30px;',
                    reference: 'Message',
                }
            ]
        }
    ]


    // listeners: {
    //     painted: 'onLoginViewPainted'
    // }

});
