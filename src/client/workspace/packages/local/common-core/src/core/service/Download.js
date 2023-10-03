Ext.define('Common.core.service.Download', {
    alternateClassName: 'DL',
    singleton: true,

    isWeChatBrowser(){
        let userAgent = Ext.browser.userAgent.toLowerCase(),
            result = userAgent.includes('MicroMessenger'.toLowerCase());
        if(!result)  return false;
        MsgBox.alert(I18N.getDefaultMessageTitle(), I18N.get('IsMicroMessenger'));
        return true;
    },

    getFile(url,filename, fileType, params){
        if(Ext.platformTags.phone && this.isWeChatBrowser()) return;
        Ext.Ajax.request({
            method: 'GET',
            url: url,
            params: params,
            filename: filename,
            fileType: fileType,
            binary: true,
            scope: this,
            timeout: 180000,
            success: this.onSuccess,
            failure: Failure.ajax
        }) 
    },

    onSuccess(response, options){
        if(options.binary) 
            this.saveAs(response.responseBytes,options.filename,options.fileType);
    },

    saveAs(bytes,filename,fileType){
        let blob = new Blob([bytes], {type:fileType}),
            a = document.createElement("a"),
            evt = document.createEvent("MouseEvents");
        a.innerHTML = filename;
        a.download = filename;
        a.href = URL.createObjectURL(blob);
        evt.initEvent("click", false, false);
        a.dispatchEvent(evt); 
    },

    string2Bytes(data){
        let ln = data.length;
        let ln2 = Math.ceil(ln/2);
        let j=0;
        let bytes= new Uint8Array(ln2);
        for(let i=0;i<ln;i=i+2){
            let t = data[i] + data[i+1];
            bytes[j] = parseInt(t,16);
            j++;
        }
        return bytes;
    },

    base64ToUint8Array(string) {
        let raw = atob(string),
            rawLength = raw.length,
            array = new Uint8Array(new ArrayBuffer(rawLength));
        for (var i = 0; i < rawLength; i += 1) {
          array[i] = raw.charCodeAt(i);
        }
        return array;
    }      


});
