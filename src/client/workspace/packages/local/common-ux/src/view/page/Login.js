Ext.define('Common.view.page.Login',{
    extend: 'Common.view.page.Base',
    xtype: 'login',

    langTitle: 'Login',
    defaultListenerScope: true,
    bodyCls: 'bg-lock-screen',

    items:[
        {
            xtype: 'container',
            layout: 'vbox',
            padding: '20',
            responsiveConfig:{
                desktop:{
                    width: 415
                },
                phone:{
                    minWidth: '90%'
                }
            },
            defaults : {
                margin : '5 0'
            },
            userCls: 'bg-color-white',
            items:[
                {
                    xtype: 'component',
                    userCls: 'lh-30',
                    langHtml: 'WelcomeLogin'
                },
                {
                    xtype: 'textfield',
                    autoLabel: false,
                    itemId: 'username',                    
                    height: 55,
                    required: true,
                    autoComplete: false,
                    langPlaceholder: 'Username/Email/Phone',
                    errorTarget: 'qtip',
                    keyMap:{
                        enter:{
                            handler: 'doEnterNextField'
                        }
                    },
                    triggers:{
                        expand: {
                            iconCls: 'x-fa fa-user auth-trigger-icon',
                            width:50                            
                        }
                    },
                },
                {
                    xtype: 'passwordfield',
                    height: 55,
                    langPlaceholder: 'Password',
                    autoLabel: false,
                    itemId: 'password',
                    autoComplete: false,
                    required: true,
                    errorTarget: 'qtip',
                    keyMap:{
                        enter:{
                            handler: 'onLogin'
                        }
                    },
                    triggers:{
                        expand: {
                            iconCls: 'x-fa fa-lock auth-trigger-icon',
                            width:50                            
                        }
                    }
                },
                {
                    xtype: 'component',
                    userCls: 'text-right lh-30 btn-link cursor-pointer',
                    langHtml: 'ForgotPassword',
                    listeners:{
                        tap:{
                            fn: 'onForgotPassword',
                            element: 'element'
                        }
                    }
                },
                {
                    xtype: 'button',
                    height:48,
                    style: 'font-size:16px;line-height:20px',
                    ui: 'soft-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    langText: 'Login',
                    formBind: true,
                    listeners:{
                        tap: 'onLogin',
                    }
                },
                {
                    xtype: 'component',
                    style: 'font-size:16px;',
                    itemId: 'errorCmp',
                    hidden: true,
                }
            ]
        }
    ],

    onLogin(){
        let me = this,
            username = me.down('#username'),
            password = me.down('#password');
        if(!username.validate() || !password.validate()) {
            if(Ext.platformTags.phone){
                me.showMessage(me.getValidateError(username, password) , me.errorCls);
            }
            return;
        }
        me.getErrorCmp().setHidden(true);
        me.setMasked(I18N.get('Signing'))
        Auth.signinResourceOwnerCredentials(username.getValue(), password.getValue())
            .then(me.onLoginSuccess.bind(me), me.onLoginFailure.bind(me));
    },

    onLoginSuccess(){
        let me = this,
            password = me.down('#password');
        me.setMasked(null);
        me.showMessage(I18N.get('LoginSuccess'), 'text-success text-center');        
        password.setValue(null);
        password.setError(null);

    },

    onLoginFailure(error){        
        let me = this;
        me.setMasked(null);
        me.showMessage(error.message, 'text-alert  text-center');
    },


    doEnterNextField(event){
        this.down('#password').focus();
        event.preventDefault();
        return false;
    },

    onForgotPassword(){
        Ext.History.add('forgotpassword');
    },

    getErrorCmp(){
        return this.down('#errorCmp');
    },

    showMessage(message, cls){
        let cmp = this.getErrorCmp();
        cmp.setHtml(message);
        cmp.setUserCls(cls);
        cmp.setHidden(false);
    }

})