/**
 * 全局异常处理
 */
Ext.define('Common.Shared.util.Failed', {
    singleton: true,
    alternateClassName: 'FAILED',

    isPhone: function(){
        return Ext.os.deviceType === 'Phone';
    },

    /**
     * 处理Ajax错误
     * @param {Ajax返回的响应信息} response 
     * @param {Ajax的参数值} options 
     * @param {视图} view 
     */
    ajax: function (response, options,view) {
        let title = I18N.FailedTitle;
        view = view && view.isPanel ? view : ((this.getView && this.getView()) || Ext.Viewport)
        if(view && view.unmask) view.unmask();
        if(view && view.setMasked) view.setMasked(false);
        if (response.status === 404) {
            Ext.Msg.alert(title, I18N.Failed404);
        } else if (response.status === 500) {
            responseText = response.responseText || response.response.responseText;
            if(Ext.isEmpty(responseText)){
                Ext.Msg.alert(title,I18N.Failed500);
                return;
            }
            const obj = Ext.decode(responseText, true);
            if(obj && obj.error && obj.error.message){
                FAILED.toast(obj.error.message ,view, 'bl');
            }else{
                Ext.Msg.alert(title, I18N.Failed500);
            }
        }else if(response.status === 400){
            const obj = Ext.decode(response.responseText);
            if(obj && obj.error && obj.error.details){
                FAILED.toast(obj.error.details ,view, 'bl');
            }else{
                Ext.Msg.alert(title, I18N.Failed500);
            }
        } else if (!Ext.isEmpty(response.responseText)) {
            Ext.Msg.alert(title, Ext.String.format(I18N.FailedOtherCode, response.status, response.responseText));
        }else{
            Ext.Msg.alert(title,I18N.Failed500)
        }
    },

    /**
     * 处理代理错误
     * @param {代理} proxy 
     * @param {Ajax返回的响应信息} response 
     * @param {Ajax的参数值} options 
     * @param {事件参数} eOpts 
     */
    proxy: function (proxy, response, options, eOpts) {
        var status = response.status;
        if (status === 200 && !Ext.isEmpty(options.error)) {
            Ext.Msg.alert(I18N.FailedTitle, options.error);
        }else if (status === 500 || status === 400 ) {
            let obj = response.responseJson;
            if(obj && obj.error && obj.error.message){
                Ext.Msg.alert(I18N.FailedTitle,obj.error.message);
            }
        } else {
            FAILED.ajax(response, options);
        }
    },

    /**
     * 处理表单提交错误
     * @param {表单} form 
     * @param {表单的返回结果} result 
     * @param {表单的响应信息} responseText 
     */
    form: function(form, result,responseText) {
        if(form) {
            if(form.unmask) form.unmask();
            if(form.setMasked) form.setMasked(false);
        }
        var response = Ext.decode(responseText,true) || {};
        if (response.error && response.error.validationErrors && 
            Ext.isArray(response.error.validationErrors) && response.error.validationErrors.length>0) {  //abp errors
            let errors = FAILED.processValidationErrors(response.error.validationErrors);
            if(form) form.setErrors(errors);
            return;
        };
        if (result.status === 500) {
            if (response.error && response.error.message) {
                FAILED.toast(response.error.message + (response.error.details ? response.error.details : ''),form,'bl');
            }
            return;
        }
        FAILED.ajax(result,null,form);
    },

    /**
     * 转换表单的字段错误信息
     * @param {错误列表} errors 
     */
    processValidationErrors: function(errors) {
        var result = {};
        for (const error of errors) {
            for (const field of error.members) {
                if(!Ext.isArray(result[field])) result[field] = [];
                result[field].push(error['message']);              
            }
        }
        return result;
    },

    toast: function(msg, el,align){
        if(FAILED.isPhone()){
            Ext.toast(msg,3000);
        }else{
            Ext.toast(
                msg,
                el,
                align
            );
        }
    }

});
