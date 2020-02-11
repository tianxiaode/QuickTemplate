Ext.define('Common.Desktop.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    mixins:[
        'Common.Desktop.mixin.viewController.Keyboard'
    ],
    //TODO: implement central Facebook OATH handling here

    onLoginButton: function () {
        var me = this,
            form =me.getView();
        if (!form.validate()) return;
        form.submit({
            jsonData:form.getValues(),
            url: URI.get('api/TokenAuth', 'Authenticate', true),
            waitMsg: I18N.LoginSubmitWaitMsg,
            waitTitle: I18N.LoginSubmitWaitTitle,
            success: function(form, result,data) {
                var rememberMe = form.getValues().rememberClient || false,
                    view = this.getView(),
                    tokenExpireDate,
                    msg = I18N.UnknownError;
                if (result.success) {
                    tokenExpireDate = rememberMe ? (new Date(new Date().getTime() + 1000 * result.result.expireInSeconds)) : null
                    HEADERS.setCookies(HEADERS.authTokenCookieName, result.result.accessToken, tokenExpireDate);
                    HEADERS.setCookies(HEADERS.encrptedAuthTokenName, result.result.encryptedAccessToken, tokenExpireDate, LOCALPATH);
                    window.location.reload();
                } else {
                    if (result.error && result.error.message)
                        msg = result.error.message + (result.error.details ? result.error.details : '');
                    Ext.toast.show(
                        msg,
                        view,
                        'bl'
                    );
                }
            },
            failure: function(sender,options,responseText) {
                FAILED.form(sender,options,responseText);
            },
            scope: me
        });
    },

    onResetClick:  function() {
        var me = this,
            view = me.getView(),
            form = view.getForm();
        if (!form.isValid()) return;
        form.submit({
            url: URI.get('account', 'passwordreset'),
            waitMsg: I18N.SaveWaitMsg,
            waitTitle: I18N.PasswordResetTitle,
            success: function (form, action) {
                TOAST.toast(I18N.PasswordResetSuccess, view.el, null, function () {
                    window.location.reload(); 
            
                });
            },
            failure: FAILED.form,
            scope: me
        });
    },

    onReturnClick: function () {
        window.history.back();
    },


});