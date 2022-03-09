Ext.define('Common.shared.view.authentication.ResetPassword',{
    extend: 'Common.shared.view.authentication.LockingWindow',
    xtype: 'shared-resetpassword',

    requires:[
        'Ext.Button',
        'Ext.field.Text',
        'Ext.field.Hidden',
        'Ext.field.Password',
        'Common.shared.ux.data.validator.Password', 
    ],

    langTitle: 'ResetPassword',
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
                    langHtml: 'EnterNewPassword'
                },
                { 
                    xtype: 'hiddenfield', 
                    name: 'c', 
                    itemId: 'resetCodeField', 
                },
                {
                    xtype: 'passwordfield',
                    height: 55,
                    autoLabel: false,
                    langPlaceholder: 'NewPassword',
                    validators: 'password',
                    autoComplete: false,
                    required: true,
                    keyMapEnabled: true,
                    itemId: 'newPassword',
                    keyMap:{
                        enter:{
                            handler: 'onNext'
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
                    xtype: 'passwordfield',
                    height: 55,
                    langPlaceholder: 'ConfirmPassword',
                    autoLabel: false,
                    autoComplete: false,
                    required: true,
                    validators(value){
                        var form = this.up(),
                            p = form.down('#newPassword'),
                            v = p.getValue();
                        if( v !== value ) return I18N.get('PasswordNoEqual');
                        return true;
                    },
                    keyMapEnabled: true,
                    itemId: 'confirmPassword',
                    keyMap:{
                        enter:{
                            handler: 'onOk'
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
                    xtype: 'button',
                    height:48,
                    style: 'font-size:16px;line-height:20px',
                    ui: 'soft-light-green',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    langText: 'OK',
                    listeners:{
                        tap: 'onOk',
                    }
                },
                {
                    xtype: 'button',
                    height:48,
                    style: 'font-size:16px;line-height:20px',
                    ui: 'action',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    langText: 'Return',
                    listeners:{
                        tap: 'onReturn',
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

    initialize(){
        let me = this,
            location = window.location,
            hash = location.hash,
            index = hash.indexOf('?'),
            query = Ext.Object.fromQueryString(index>0 ? hash.substr(index) || '' : location.search || '');            
        me.callParent(arguments);
        me.down('#resetCodeField').setValue(query.c || '' );
    },



    onOk(){
        let me = this,
            password = me.down('#newPassword'),
            confirm = me.down('#confirmPassword');
        if(!password.validate() || !confirm.validate) {
            if(Ext.platformTags.phone){
                me.showMessage(me.getValidateError(password, confirm) , me.errorCls);
            }
            return;
        }
        me.getErrorCmp().setHidden(true);
        me.setMasked(I18N.get('Submitting'));
        Http.post(URI.crud('account','reset-password'), {
            password: password.getValue(),
            confirmPassword: confirm.getValue(),
            c: me.down('#resetCodeField').getValue()
        }).then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
    },

    getValidateError(password, confirm){
        let passwordError= password.getError(),
            confirmError = confirm.getError();
        if(Ext.isEmpty(passwordError)) return passwordError;
        if(Ext.isEmpty(confirmError)) return confirmError;
        return `${passwordError}<br>${confirmError}`;
    },


    onSubmitSuccess(){
        this.showMessage(I18N.get('PasswordResetSuccess'), this.successCls);
        
    },

    onSubmitFailure(response){        
        this.showMessage(Failure.getError(response), this.errorCls);
        
    },

    doEnterNextField(event){
        this.down('#emailAddress').focus();
        event.preventDefault();
        return false;
    },

    onReturn(){
        window.location.href = '.';
        //Ext.History.add(Ext.getApplication().getDefaultToken());
    }

})