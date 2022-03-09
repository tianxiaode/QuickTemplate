Ext.define('Common.shared.view.authentication.ForgotPassword',{
    extend: 'Common.shared.view.authentication.LockingWindow',
    xtype: 'shared-forgotpassword',

    requires:[
        'Ext.Button',
        'Ext.field.Text',
        'Ext.field.Password',
        'Ext.tab.Bar',
        'Common.shared.ux.data.validator.Mobile'
    ],

    langTitle: 'ForgotPassword',
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
                    xtype: 'tabbar',
                    ui: 'light-white',
                    defaultTabUI: 'light-white',
                    activeTab: 0,
                    items:[
                        {
                            flex: 1,
                            langText: 'Mobile'
                        },
                        {
                            flex: 1,
                            langText: 'Email'
                        },
                    ],
                    listeners:{
                        activeTabchange: 'onTabTap',
                    }
                },
                {
                    xtype: 'component',
                    userCls: 'lh-30',
                    langHtml: 'ForgotPasswordMessage',
                },
                {
                    xtype: 'textfield',
                    autoLabel: false,
                    height: 55,
                    required: true,
                    autoComplete: false,
                    validators: 'mobile',                    
                    inputMask: '99999999999',
                    langPlaceholder: 'Mobile',
                    itemId: 'phoneField',
                    triggers:{
                        expand: {
                            iconCls: 'x-fa fa-phone auth-trigger-icon',
                            width:50                            
                        }
                    },
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    itemId: 'validateCodeContainer',
                    items:[
                        {
                            xtype: 'textfield',
                            itemId: 'validateCode',
                            required: true,
                            height: 55,
                            minLength: 6,
                            maxLength: 6,
                            flex: 1,
                            autoLabel: false,
                            langPlaceholder: 'ValidateCode',
                        },
                        {
                            xtype: 'button',
                            margin: '4px 0 0 5px',
                            height:48,
                            width: 90,                            
                            itemId: 'sendButton',
                            langText: 'Send',
                            handler: 'onSendValidateCode'
                        }
                    ]
                },
                {
                    xtype: 'emailfield',
                    autoLabel: false,
                    height: 55,
                    required: true,
                    autoComplete: false,
                    validators: 'email',                    
                    langPlaceholder: 'EmailAddress',
                    itemId: 'emailAddress',
                    hidden: true,
                    triggers:{
                        expand: {
                            iconCls: 'x-fa fa-envelope auth-trigger-icon',
                            width:50                            
                        }
                    },
                    keyMapEnabled: true,
                    keyMap:{
                        enter:{
                            handler: 'onOk'
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
                    formBind: true,
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
                    formBind: true,
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

    currentMode: 'Mobile',
    onOk(){
        let me = this,
            isMobile = me.currentMode === 'Mobile';
        isMobile && me.onResetByPhone();
        !isMobile && me.onResetByEmail();
    },

    onResetByPhone(){
        let me = this,
            phoneField = me.down('#phoneField'),
            codeField = me.down('#validateCode');
        if(!phoneField.validate() || !codeField.validate()) return;
        let values = { phone: phoneField.getValue(), code: codeField.getValue(), mode: 'Mobile' };

        Http.post(URI.crud('account', 'reset-code'), values)
            .then(me.onPhoneValidateSuccess, me.onPhoneValidateFailure, null,me);
    },

    onPhoneValidateSuccess(response){
        let data = Http.parseResponseText(response);
        Ext.History.add(`resetpassword?c=${encodeURIComponent(data.result.code)}`);
    },

    onPhoneValidateFailure(response){
        this.showMessage(Failure.getError(response), this.errorCls);

    },

    onResetByEmail(){
        let me = this,
            email = me.down('#emailAddress');
        if(!email.validate()) {
            if(Ext.platformTags.phone){
                me.showMessage(me.getValidateError(email) , me.errorCls);
            }
            return;
        }
        me.getErrorCmp().setHidden(true);
        me.setMasked(I18N.get('Submitting'));
        Http.post(URI.crud('account','reset-code'), {emailAddress: email.getValue(), mode: 'Email'})
            .then(me.onSendResetCodeSuccess, me.onSendResetCodeFailure, null, me);

    },

    getValidateError(email){
        return email.getError();
    },


    onSendResetCodeSuccess(){
        this.showMessage(I18N.get('SendPasswordResetCodeSuccessMessage'), this.successCls);
        
    },

    onSendResetCodeFailure(response){        
        this.showMessage(Failure.getError(response), this.errorCls);
        
    },

    doEnterNextField(event){
        this.down('#emailAddress').focus();
        event.preventDefault();
        return false;
    },

    onReturn(){
        Ext.History.back();
    },

    onSendValidateCode(sender){
        let me = this,
            phone = me.getPhone();
        Http.post(URI.crud('account', 'validate-code'), {phone: phone});
        sender.setDisabled(true);
        me.countdown = 60;
        Ext.TaskManager.start(me.getTask());
    },

    getTask(){
        let me = this,
            task = me.task;
        if(!task){
            task = me.task = {
                run: me.updateSendState,
                interval: 1000,
                scope: me
            }
        }
        return task;
    },

    updateSendState(){
        let me = this,
            task = me.getTask(),
            button = me.down('#sendButton'),
            text = I18N.get('Send');
        me.countdown--;
        if(me.countdown<=0){
            button.setDisabled(false);
            button.setText(text);
            Ext.TaskManager.stop(task);
            return;
        }
        button.setText(`${text}(${me.countdown})`);
    },

    onTabTap(sender, newTab){
        let me = this,
            text = newTab.getLangText(),
            isMobile = text === 'Mobile';
        me.currentMode = text;
        me.down('#phoneField').setHidden(!isMobile);
        me.down('#validateCodeContainer').setHidden(!isMobile);
        me.down('#emailAddress').setHidden(isMobile);
    },

    getPhone(){
        let me = this,
            phoneField = me.down('#phoneField');
        return phoneField.validate() ? phoneField.getValue() : null;
    }
})