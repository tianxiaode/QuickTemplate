Ext.define('Common.service.HttpClient',{
    alternateClassName: 'Http',
    singleton: true,

    httpMethod:{
        Post: 'POST',
        Put: 'PUT',
        Get: 'GET',
        Delete: 'DELETE',
        Patch: 'PATCH'
    },

    constructor(){
        let me = this;
        //Ajax提交时，注入认证头
        Ext.Ajax.setCors(true);
        Ext.Ajax.on('beforerequest', me.onAjaxBeforeRequest, me);
    },


    onAjaxBeforeRequest(conn, options, eOpts){
        if(!options.headers) options.headers = this.defaultHeaders();
    },

    post(url ,data,headers, opts){
        return this.send(data, url, this.httpMethod.Post, headers, opts);
    },

    put(url ,data, headers, opts){
        return this.send(data, url, this.httpMethod.Put, headers, opts);
    },

    patch(url, data,headers, opts){
        return this.send(data, url, this.httpMethod.Patch, headers, opts);
    },

    get(url, data, headers, opts, binary){
        return this.send(data, url, this.httpMethod.Get, headers, opts, false, binary);
    },    

    delete(url, data, headers, opts){
        return this.send(data,url, this.httpMethod.Delete, headers, opts);
    },

    upload(url, data, headers, opts){
        return this.send(data,url, this.httpMethod.Post, headers, opts, true);
    },

    postScriptError(msg, url, line, col, error){
        Http.post(URI.get('script-errors'),{
            source: url,
            message: msg,
            line: line,
            column: col,
            error: error
        });
    },

    defaultHeaders(){
        return {
            'Authorization' : 'Bearer ' +  AppStorage.get('access_token'),
            //'Access-Control-Allow-Origin': '*',
            "accept-language": AppStorage.get('lang')  || (AppConfig.lang === 'zh-CN' ? 'zh-Hans' 
                : AppConfig.lang === 'zh-TW' ? 'zh-Hant' : AppConfig.lang )
        };

    },
    
    send(data, url,  method, headers,opts, isUpload, binary){  
        let me = this,
            options = Object.assign({
                url : url,
                method: method,
                headers: headers || me.defaultHeaders()
        }, opts);
        if(binary) options.binary = true;
        if(data){
            if(method === me.httpMethod.Get) {
                options.params = data
            }else if(isUpload){
                options.xhr2 = true;
                options.headers['Content-Type'] = null;
                options.rawData = data;
            }else{
                let contentType = options.headers['Content-Type'];
                if(contentType && contentType.includes('x-www-form')){
                    options.rawData = Ext.Object.toQueryString(data);
                }else{
                    //options.headers["accept-language"] = "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2"
                    options.jsonData = data;
                }
            };
        }
        return Ext.Ajax.request(options);
    },

    parseResponse(response){
        let responseText = response.responseBytes && Http.utf8ByteToUnicodeStr(response.responseBytes) 
            || response.responseText;
        return Ext.decode(responseText, true);
    },

    getError(response, resourceName){
        let status = response && response.status,            
            data = response,
            returnObj = Http.parseResponse(response),
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
            error = Http.getValidationErrors(response.responseJson || returnObj, resourceName);
            error = Http.buildValidationErrors(error, resourceName);
            return error;
        };
        if(status) data = response.responseType === 'json' ? response.responseJson : returnObj;
        if(!(data && data.error)) return response;
        if(data.error.validationErrors) return Http.getValidationErrors(data, resourceName);
        if(!Ext.isString(data.error)){
            error = data.error.message;
            if(!Ext.isEmpty(data.error.details)) 
            {
                error += `:${data.error.details}`;
            }
        }
        return error.replace('\r', '<br/>').replace('\r\n', '<br/>');
    },


    getBlobData(response, mimeType){
        let bytes = response.responseBytes,
            blob = new Blob([bytes], {type:mimeType});
        return blob;
    },

    privates:{

        utf8ByteToUnicodeStr(utf8Bytes){
            var unicodeStr ="";
            for (var pos = 0; pos < utf8Bytes.length;){
                var flag= utf8Bytes[pos];
                var unicode = 0 ;
                if ((flag >>>7) === 0 ) {
                    unicodeStr+= String.fromCharCode(utf8Bytes[pos]);
                    pos += 1;
        
                } else if ((flag &0xFC) === 0xFC ){
                    unicode = (utf8Bytes[pos] & 0x3) << 30;
                    unicode |= (utf8Bytes[pos+1] & 0x3F) << 24;
                    unicode |= (utf8Bytes[pos+2] & 0x3F) << 18;
                    unicode |= (utf8Bytes[pos+3] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos+4] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos+5] & 0x3F);
                    unicodeStr+= String.fromCharCode(unicode) ;
                    pos += 6;
        
                }else if ((flag &0xF8) === 0xF8 ){
                    unicode = (utf8Bytes[pos] & 0x7) << 24;
                    unicode |= (utf8Bytes[pos+1] & 0x3F) << 18;
                    unicode |= (utf8Bytes[pos+2] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos+3] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos+4] & 0x3F);
                    unicodeStr+= String.fromCharCode(unicode) ;
                    pos += 5;
        
                } else if ((flag &0xF0) === 0xF0 ){
                    unicode = (utf8Bytes[pos] & 0xF) << 18;
                    unicode |= (utf8Bytes[pos+1] & 0x3F) << 12;
                    unicode |= (utf8Bytes[pos+2] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos+3] & 0x3F);
                    unicodeStr+= String.fromCharCode(unicode) ;
                    pos += 4;
        
                } else if ((flag &0xE0) === 0xE0 ){
                    unicode = (utf8Bytes[pos] & 0x1F) << 12;;
                    unicode |= (utf8Bytes[pos+1] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos+2] & 0x3F);
                    unicodeStr+= String.fromCharCode(unicode) ;
                    pos += 3;
        
                } else if ((flag &0xC0) === 0xC0 ){ //110
                    unicode = (utf8Bytes[pos] & 0x3F) << 6;
                    unicode |= (utf8Bytes[pos+1] & 0x3F);
                    unicodeStr+= String.fromCharCode(unicode) ;
                    pos += 2;
        
                } else{
                    unicodeStr+= String.fromCharCode(utf8Bytes[pos]);
                    pos += 1;
                }
            }
            return unicodeStr;
        },

        getValidationErrors(data, resourceName) {
            let result = {}, 
                validationErrors = data.error && data.error.validationErrors;
            validationErrors.forEach(e=>{
                e.members.forEach(f=>{
                    if(!Ext.isArray(result[f])) result[f] = [];
                    result[f].push(e['message']);
                });
            })
            return result;
        },
    

        buildValidationErrors(errors,resourceName){
            let msg = '<ul class="message-tips">';
            for(let e in errors){
                let error = errors[e];
                if(!Ext.isArray(error)) continue;
                let fieldName = I18N.get(Format.capitalize(e), resourceName);
                if(Ext.isEmpty(fieldName)) continue;
                msg += `<li class="text-danger lh-20"><b>${fieldName}</b>： ${error.join('<br>')}</li>`;
            }
            msg += '</ul>'
            return msg;
        },

  
    }


})