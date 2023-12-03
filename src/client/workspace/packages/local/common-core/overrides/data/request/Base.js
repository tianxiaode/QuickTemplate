Ext.define('Common.overrides.data.request.Base',{
    override: 'Ext.data.request.Base',

    requires:[
        'Common.core.util.HttpStatusCode'
    ],

    getJson(){
        let me = this,
            result = me.result,
            text = result.responseText;
        if(Ext.isEmpty(text)) return {};
        try {
            let data = Ext.decode(text, true);
            return data;            
        } catch (error) {
            Logger.debug(me.getJson, error);
            return {};
        }
    },

    download(filename, mimeType){
        let me = this;
        if(Ext.platformTags.phone && me.isWeChatBrowser()) return;
        let blob = me.getFile(mimeType),
            a = document.createElement("a"),
        evt = document.createEvent("MouseEvents");
        filename = filename || (Ext.data.identifier.Uuid.Global.generate() + MimeTypeExt.getSuffixes(blob.type)[0]);
        a.innerHTML = filename;
        a.download = filename;
        a.href = URL.createObjectURL(blob);
        evt.initEvent("click", false, false);
        a.dispatchEvent(evt); 
    },

    isWeChatBrowser(){
        let userAgent = Ext.browser.userAgent.toLowerCase(),
            result = userAgent.includes('MicroMessenger'.toLowerCase());
        if(!result)  return false;
        MsgBox.alert(I18N.getDefaultMessageTitle(), I18N.get('IsMicroMessenger'));
        return true;
    },


    getFile(mimeType){
        let me = this,
            headers = response.getAllResponseHeaders();
        if(!me.binary){
            Ext.raise('Non-binary data.');
        }
        mimeType = mimeType || (headers && headers['content-type']);
        if(!mimeType){
            Ext.raise('unknown mime type');
        }
        let bytes = me.responseBytes,
            blob = new Blob([bytes], { type: mimeType });
        return blob;
    },

    getError(defaultMessage) {
        let me  = this,
            status = me.result.status,
            data = me.getJson(),
            result = Ext.apply({code: null,  message:  null, details: null, data: null, validationErrors: null }, data && data.error);

        if(status === 0){
            let message = me.result.statusText;
            result.message = Ext.isEmpty(message) ? defaultMessage : message;
            return result;
        }

        if(status >= 400 && Ext.isEmpty(result.message)){
            result.message = me.getStatusMessage(status);
            Logger.debug(me.getError, result.message, me);
            return result;
        }

        if(result.validationErrors){
            result.validationErrors = me.normalizedValidationErrors(result.validationErrors);
        }

        return result;
    },

    normalizedValidationErrors(errors) {
        let result = {};
        errors.forEach(e => {
            let message = e.message;
            e.members.forEach(f => {
                if (!Ext.isArray(result[f])) result[f] = [];
                result[f].push(message);
            });
        })
        return result;
    },

    privates:{
        getStatusMessage(code){
            return Ext.String.capitalize(Format.splitCamelCase(HttpStatusCode.getMessage(code), ' '));
        }    
    }




})