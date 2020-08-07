Ext.define('Common.shared.util.Failure', {
    singleton: true,
    alternateClassName: 'Failure',

    requires:[
        'Common.shared.ux.MessageBox',
        'Common.shared.ux.Toast',
    ],

    ajax(response) {
        console.log(response)
        const me = this,
            view = me.isViewController ? view.getView() : me.isContainer ? me : Ext.Viewport,
            service = window.I18N,
             title = service && service.getDefaultMessageTitle();
        if(view && view.setMasked) view.setMasked(false);
        if(!I18N.isReady){
            Ext.on('localizedready', me.ajax, me ,{ single: true, args: [response]} );
            return;
        }
        if(response.status === 401){
            const error = I18N.getLocalText('Error401');
            MsgBox.alert(title , error);
            return error;    
        }
        let obj  = response.responseJson || Ext.decode(response.responseText, true),
            error = service && service.getUnknownError();
        if(obj && obj.error) {
            if(Ext.isString(obj.error)){
                error = obj.error_description;
            }else{
                error = obj.error.message;
                if(!Ext.isEmpty(obj.error.code)) error += `[${obj.error.code}]`;
                if(!Ext.isEmpty(obj.error.details)) 
                    error += `[${obj.error.code}]${service && service.getLabelSeparator() || ':'}${obj.error.details}`;
                MsgBox.alert(title, error);
                return error;    
            }
            
        }
        MsgBox.alert(title , error);
        return error;
    },

    // proxy: function (proxy, response, options, epots) {
    //     var status = response.status;
    //     if (status === 200 && !Ext.isEmpty(options.error)) {
    //         Ext.Msg.alert(I18N.FailedTitle, options.error);
    //     }else if (status === 500 || status === 400 ) {
    //         let obj = response.responseJson;
    //         if(obj && obj.error && obj.error.message){
    //             Ext.Msg.alert(I18N.FailedTitle,obj.error.message);
    //         }
    //     } else {
    //         FAILED.ajax(response, options);
    //     }
    // },

    // form: function(form, result,responseText) {
    //     if(form) {
    //         if(form.unmask) form.unmask();
    //         if(form.setMasked) form.setMasked(false);
    //     }
    //     var response = Ext.decode(responseText,true) || {};
    //     if (response.error && response.error.validationErrors && 
    //         Ext.isArray(response.error.validationErrors) && response.error.validationErrors.length>0) {  //abp errors
    //         let errors = FAILED.processValidationErrors(response.error.validationErrors, form);
    //         if(form) form.setErrors(errors);
    //         return;
    //     };
    //     if (result.status === 500) {
    //         if (response.error && response.error.message) {
    //             FAILED.toast(response.error.message + (response.error.details ? response.error.details : ''),form,'bl');
    //         }
    //         return;
    //     }
    //     FAILED.ajax(result,null,form);
    // },

    // processValidationErrors: function(errors, form) {
    //     console.log(form)
    //     var result = {}, 
    //         msg = [],
    //         entityName = (form.getEntityName && form.getEntityName()) || form.entityName;
    //     for (const error of errors) {
    //         for (const field of error.members) {
    //             if(!Ext.isArray(result[field])) result[field] = [];
    //             result[field].push(error['message']);
    //             if(I18N.Model[entityName] && I18N.Model[entityName][field])
    //                 msg.push(`${I18N.Model[entityName][field]}-${error['message']}`);
    //         }
    //     }
    //     Ext.toast(msg.join('<br>'), form);
    //     return result;
    // },

    // toast: function(msg, el,align){
    //     if(FAILED.isPhone()){
    //         Ext.toast(msg);
    //     }else{
    //         Ext.toast(
    //             msg,
    //             el,
    //             align
    //         );
    //     }
    // }

});
