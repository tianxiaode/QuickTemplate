Ext.define('Common.Desktop.authentication.ResetPasswordController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.resetpasswordcontroller',

    mixins:[
        'Common.Desktop.mixin.viewController.Keyboard'
    ],


    init() {
        let me = this,
            location = window.location,
            hash = location.hash,
            index = hash.indexOf('?'),
            query = Ext.Object.fromQueryString(index>0 ? hash.substr(index) || '' : location.search || ''),
            refs = me.getReferences();
        refs.ResetCode.setValue(query.c || '');
    },

    clearMessage(){
        let me = this,
            message = me.lookupReference('Message');
        message.setHtml(''); 
    },

    onSave(){
        let me = this,
            form = me.getView(),
            values = form.getValues();
        me.clearMessage();
        if (!form.validate()) return;
        form.submit({
            jsonData:values,
            url: URI.get('account', 'ResetPassword'),
            waitMsg: I18N.Submitting,
            success: function(form, result,data) {
                let me = this,
                    message = me.lookupReference('Message');
                message.removeCls('red');
                message.addCls('green');
                message.setHtml(I18N.ResetPasswordSuccessMessage);                    
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