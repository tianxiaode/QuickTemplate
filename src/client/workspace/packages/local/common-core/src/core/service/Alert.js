Ext.define('Common.core.service.Alert', {
    alternateClassName: 'Alert',
    singleton: true,

    requires:[
        'Ext.Toast',
        'Ext.MessageBox'
    ],

    info(message, useMessageBox, title, opts){
        return this.show(message, useMessageBox, title, opts, 'info');
    },

    success(message, useMessageBox, title, opts){
        return this.show(message, useMessageBox, title, opts, 'success');
    },

    warn(message, useMessageBox, title, opts){
        return this.show(message, useMessageBox, title, opts, 'warning');
    },

    error(message, useMessageBox, title, opts){
        return this.show(message, useMessageBox, title, opts, 'alert');
    },

    show(message, useMessageBox, title, opts, cls){
        let me = this;
        if(useMessageBox){
            Ext.Msg.show(me.getMessageBoxConfig(message, title, cls, opts));
            return;
        }

        Ext.toast(me.getToastConfig(message, cls, opts));
    },

    confirm(title, message, data){
        let deferred = new Ext.Deferred()
        this.show(message, true, title, {
            buttons: Ext.MessageBox.YESNO,
            defaultFocus: '#yes',
            prompt: false,
            fn: (btnId) => {
                if(btnId === 'yes'){
                    deferred.resolve(data);
                }else{
                    deferred.reject(data);
                }
            }
        });
        return deferred.promise;
    },

    ajax(){
        let defaultMessage = arguments[0],
            response = arguments[1];
        this.unmask && this.unmask();
        if(!Ext.isString(defaultMessage)){
            response = defaultMessage;
            defaultMessage = '';
        }
        let error = response.request.getError(defaultMessage),
            message = `${error.message}`;
        if(error.details){
            message += `: ${error.details}`;
        }
        Alert.error(message);
    },

    privates:{
        getToastConfig(message, cls, opts){
            return Ext.apply({
                message: message,
                bodyCls: cls                
            }, opts);
        },

        getMessageBoxConfig(message, title, cls, opts){
            return Ext.apply({
                message: message,
                minWidth: 300,
                title: title,
                header:{                    
                    userCls: cls
                }
            }, opts);
        }
    }

})
