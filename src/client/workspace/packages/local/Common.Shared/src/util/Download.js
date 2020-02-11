/**
 * 文件下载类
 */
Ext.define('Common.Shared.util.Download', {
    alternateClassName: 'DL',
    singleton: true,

    /**
     * 获取文件
     * @param {文件获取地址} url 
     * @param {文件名} filename 
     * @param {文件类型} fileType 
     * @param {提交参数} params 
     */
    getFile: function(url,filename, fileType, params){
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
            failure: FAILED.ajax
        }) 
    },

    /**
     * 获取文件成功
     * @param {Ajax请求的响应信息} response 
     * @param {Ajax请求的请求参数} options 
     */
    onSuccess: function(response, options){
        if(options.binary) 
            this.saveAs(response.responseBytes,options.filename,options.fileType);
    },

    /**
     * 保存文件
     * @param {文件的二进制数组} bytes 
     * @param {文件名} filename 
     * @param {文件类型} fileType 
     */
    saveAs: function(bytes,filename,fileType){
        let blob = new Blob([bytes], {type:fileType}),
            a = document.createElement("a"),
            evt = document.createEvent("MouseEvents");
        //使用A元素模拟单击事件以出发浏览器保存文件操作
        a.innerHTML = filename;
        a.download = filename;
        a.href = URL.createObjectURL(blob);
        evt.initEvent("click", false, false);
        a.dispatchEvent(evt); 
    },

    /**
     * 将字符串数据转换为二进制数组
     * @param {数据} data 
     */
    string2Bytes: function(data){
        let ln = data.length,
            ln2 = Math.ceil(ln/2),
            j=0,
            bytes= new Uint8Array(ln2);
        for(let i=0;i<ln;i=i+2){
            let t = data[i] + data[i+1];
            bytes[j] = parseInt(t,16);
            j++;
        }
        return bytes;
    },

    /**
     * 将BASE64字符串转换为二进制数组
     * @param {字符串} string 
     */
    base64ToUint8Array:function(string) {
        let raw = atob(string),
        rawLength = raw.length,
        array = new Uint8Array(new ArrayBuffer(rawLength));
        for (var i = 0; i < rawLength; i += 1) {
          array[i] = raw.charCodeAt(i);
        }
        return array;
    }
      


});
