Ext.define('Common.overrides.data.request.Base',{
    override: 'Ext.data.request.Base',

    requires:[
        'Common.localized.Localized'
    ],


    privates:{
        getStatusMessage(code){
            let origin = HttpStatusCode.getMessage(code);
                key = origin + '-' + code;
                message = I18N.get(key);
            if(message === key) return Ext.String.capitalize(Format.splitCamelCase(HttpStatusCode.getMessage(code), ' '));
            return message;

        }    
    }




})