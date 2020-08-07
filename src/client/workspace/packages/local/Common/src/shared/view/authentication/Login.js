Ext.define('Common.shared.view.authentication.Login',{
    extend: 'Common.shared.view.authentication.LockingWindow',
    xtype: 'shared-login',

    requires:[
        'Ext.field.Text',
        'Ext.field.Password',
        'Ext.dataview.List',
        'Common.shared.service.OAuth'
    ],

    title: 'Login',
    defaultListenerScope: true,

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
            userCls: 'bg-white',  
            items:[
                {
                    xtype: 'component',
                    userCls: 'lh-30',
                    localized:[ 'html'],
                    html: "Welcome to login"
                },
                {
                    xtype: 'textfield',
                    name: 'username',
                    itemId: 'username',
                    height: 55,
                    required: true,
                    autoComplete: false,
                    placeholder: 'Username/Email/Phone',
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
                    placeholder: 'Password',
                    name: 'password',
                    itemId: 'password',
                    autoComplete: false,
                    required: true,
                    triggers:{
                        expand: {
                            iconCls: 'x-fa fa-lock auth-trigger-icon',
                            width:50                            
                        }
                    }
                },
                {
                    xtype: 'component',
                    localized: [ 'html'],
                    userCls: 'text-right lh-30',
                    html: 'Forgot password'
                },
                {
                    xtype: 'button',
                    reference: 'loginButton',
                    height:48,
                    style: 'font-size:16px;line-height:20px',
                    ui: 'soft-light-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    text: 'Login',
                    formBind: true,
                    listeners:{
                        tap: 'onLogin',
                    }
                },
                {
                    xtype: 'component',
                    itemId: 'errorCmp',
                    hidden: true,
                }
            ]
        }
    ],

    onLogin(){
        const me = this,
            username = me.down('#username'),
            password = me.down('#password');
        if(!username.validate() && !password.validate()) return;
        me.setMasked(I18N.get('Signing'))
        AuthService.login(username.getValue(), password.getValue())
        .then(me.onLoginSuccess, me.onLoginFailure, null, me);
    },

    onLoginSuccess(){
        const me = this,
            errorCmp = me.down('#errorCmp');
        me.setMasked(false);
        errorCmp.setUserCls('text-success text-center lh-30')
        errorCmp.setHtml(I18N.get('LoginSuccess'));
        errorCmp.setHidden(false);
        
    },

    onLoginFailure(response){        
        const me = this,
            obj = Ext.decode(response.responseText, true),
            errorCmp = me.down('#errorCmp');
        let error = I18N.getUnknownError();
        me.setMasked(false);
        if(obj && obj.error_description) error = obj.error_description;
        errorCmp.setHtml(error);
        errorCmp.setUserCls('text-danger text-center lh-30')
        errorCmp.setHidden(false);
    }

})