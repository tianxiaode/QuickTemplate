Ext.define('Common.shared.util.Failure', {
    singleton: true,
    alternateClassName: 'Failure',

    requires:[
        'Common.shared.ux.MessageBox',
        'Common.shared.ux.Toast',
    ],

    ajax(response, resourceName, showAlert) {
        let me = this,
            view = me.isViewController ? me.getView() : me.isContainer ? me : Ext.Viewport,
            service = window.I18N,
             title = service && service.getDefaultMessageTitle();
        if(view && view.setMasked) view.setMasked(false);
        if(view && view.unmask) view.unmask();
        Ext.Viewport.unmask();
        if(!service.isReady){
            Ext.on('i18nready', me.ajax, me ,{ single: true, args: [response]} );
            return;
        }
        let error = Failure.getError(response, resourceName);
        if(showAlert) MsgBox.alert(title , error);
        return error;
    },

    ajaxWithAlert(response, resourceName){
        Failure.ajax(response, resourceName, true);
    },


    getValidationErrors(data, resourceName) {
        let result = {}, 
            validationErrors = data.error && data.error.validationErrors;
        if(!validationErrors) return Failure.getError(data, resourceName);
        validationErrors.forEach(e=>{
            e.members.forEach(f=>{
                if(!Ext.isArray(result[f])) result[f] = [];
                result[f].push(e['message']);
            })
        })
        return result;
    },

    getError(response, resourceName){
        let status = response && response.status,            
            data = response,
            returnObj = Http.parseResponseText(response),
            error = returnObj && returnObj.error && returnObj.error.message;
        if(status === 401) {
            window.location.href = '.';
            return;
        };        
        if(status === 404) {
            if(Ext.isEmpty(error))  return I18N.getLocalText('Error404');
            return error;
        };
        if(status === 405) return I18N.getLocalText('Error405');
        if(status === 415) return I18N.getLocalText('Error415');
        if(status === 400) {
            error = Failure.getValidationErrors(response.responseJson || returnObj, resourceName);
            error = Failure.buildValidationErrors(error, resourceName);
            return error;
        };
        if(status) data = response.responseType === 'json' ? response.responseJson : returnObj;
        if(!(data && data.error)) return response;
        if(data.error.validationErrors) return Failure.getValidationErrors(data, resourceName);
        if(!Ext.isString(data.error)){
            error = data.error.message;
            if(!Ext.isEmpty(data.error.details)) 
            {
                error += `:${data.error.details}`;
            }
        }
        return error.replace('\r', '<br/>').replace('\r\n', '<br/>');
    },

    buildValidationErrors(errors,resourceName){
        let msg = '<ul class="message-tips">';
        for(let e in errors){
            let error = errors[e];
            if(!Ext.isArray(error)) continue;
            let fieldName = I18N.get(Format.capitalize(e), resourceName);
            if(Ext.isEmpty(fieldName)) continue;
            msg += `<li class="danger lh-20"><b>${fieldName}</b>： ${error.join('<br>')}</li>`;
        }
        msg += '</ul>'
        return msg;
    },



});
