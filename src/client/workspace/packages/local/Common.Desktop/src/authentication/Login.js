Ext.define('Common.Desktop.authentication.Login', {
    extend: 'Common.Desktop.authentication.LockingWindow',
    xtype: 'login',

    requires: [
        'Common.Desktop.authentication.Dialog',
        'Ext.field.Text',
        'Ext.field.Checkbox',
        'Ext.Button',
        'Common.Desktop.authentication.AuthenticationController',
    
    ],

    title: I18N.LoginTitle,
    defaultFocus: 'authdialog', // Focus the Auth Form to force field focus as well
    
    items: [
        {
            xtype: 'authdialog',
            defaultButton : 'loginButton',
            bodyPadding: '20 20',
            controller: 'authentication',
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
                    html: I18N.LoginLabel
                },
                {
                    xtype: 'textfield',
                    name: 'userNameOrEmailAddress',
                    height: 55,
                    required: true,
                    autoComplete: false,
                    placeholder: I18N.UserId,
                    triggers:{
                        expane: {
                            iconCls: 'x-fa fa-user auth-trigger-icon',
                            width:50                            
                        }
                    },
                    keyMapEnabled: true,
                    keyMap:{
                        enter:{
                            handler: 'doEnterNextField'
                        }
                    }
                },
                {
                    xtype: 'passwordfield',
                    height: 55,
                    placeholder: I18N.Password,
                    name: 'password',
                    autoComplete: false,
                    required: true,
                    keyMapEnabled: true,
                    keyMap:{
                        enter:{
                            handler: 'onLoginButton'
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
                    xtype: 'container',
                    layout:{
                        type: 'hbox',
                        align: 'stretch'
                    },
                    defaults: { flex:1},
                    items:[
                        {
                            xtype: 'checkboxfield',
                            cls: 'form-panel-font-color rememberMeCheckbox',
                            bodyAlign: 'start',
                            height: 30,
                            name: 'rememberClient',
                            boxLabel: I18N.RememberMe,
                            autoLabel: false,
                            inputValue:true,
                            uncheckedValue: false,
                        },
                        {
                            xtype: 'component',
                            html: `<div style="text-align:right"> 
                                <a href="#ForgotPassword" class="link-forgot-password">${I18N.ForgotPassword}</a>
                                </div>`
                        }
                    ]
                },
                // {
                //     xtype: 'component',
                //     itemId: 'tencentCaptcha',
                // },
                {
                    xtype: 'button',
                    reference: 'loginButton',
                    height:48,
                    style: 'font-size:16px;font-weight:300;',
                    ui: 'soft-light-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: I18N.LoginTitle,
                    formBind: true,
                    listeners: {
                        tap: 'onLoginButton'
                    }
                }
            ]
        },

    ],

    initialize : function() {
        var me = this;
        me.addCls('user-login-register-container');
        me.callParent();
    },


});
