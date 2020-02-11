Ext.define('Common.Desktop.authentication.ForgotPasswordController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.forgotpasswordcontroller',

    mixins:[
        'Common.Desktop.mixin.viewController.Keyboard'
    ],

    clearMessage(){
        let me = this,
            message = me.lookupReference('Message');
        message.setHtml(''); 
    },

    onSave(){
        let me = this,
            form = me.getView();
        me.clearMessage();            
        if (!form.validate()) return
        form.submit({
            jsonData:form.getValues(),
            url: URI.get('account', 'SendPasswordResetCode'),
            waitMsg: I18N.Submitting,
            success: function(form, result,data) {
                let me = this,
                    message = me.lookupReference('Message');
                message.removeCls('red');
                message.addCls('green');
                message.setHtml(I18N.SendPasswordResetCodeSuccessMessage);                    
            },
            failure: function(sender,result, responseText) {
                if(responseText.includes('error')){
                    let me = this,
                        obj = Ext.decode(responseText, true);
                        message = me.lookupReference('Message');
                    message.removeCls('green');
                    message.addCls('red');
                    message.setHtml(obj.error.message);
                }
                FAILED.form(sender,result, responseText);
            },
            scope: me
        });
    }
});