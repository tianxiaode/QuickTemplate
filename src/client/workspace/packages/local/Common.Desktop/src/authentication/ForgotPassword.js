Ext.define('Common.Desktop.authentication.ForgotPassword', {
    extend: 'Common.Desktop.authentication.LockingWindow',
    xtype: 'forgotpassword',

    requires: [
        'Common.Desktop.authentication.Dialog',
        'Ext.field.Email',
        'Ext.Button',
        'Common.Desktop.authentication.ForgotPasswordController',
    
    ],

    title: I18N.ForgotPassword,
    defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well
    

    items: [
        {
            xtype: 'authdialog',
            defaultButton : 'submitButton',
            bodyPadding: '20 20',
            controller: 'forgotpasswordcontroller',
            header: false,
            width: 415,
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
                    html: I18N.ForgotPasswordLabel
                },
                // {
                //     xtype: 'hiddenfield',
                //     name: 'ticket',
                //     itemId: 'ticket'
                // },
                {
                    xtype: 'emailfield',
                    name: 'emailAddress',
                    height: 55,
                    required: true,
                    autoComplete: false,
                    validators: 'email',
                    placeholder: I18N.Model.User.emailAddress,
                    triggers:{
                        expane: {
                            iconCls: 'x-fa fa-envelope auth-trigger-icon',
                            width:50                            
                        }
                    },
                    keyMapEnabled: true,
                    keyMap:{
                        enter:{
                            handler: 'onSave'
                        }
                    }
                },
                {
                    xtype: 'button',
                    reference: 'submitButton',
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
