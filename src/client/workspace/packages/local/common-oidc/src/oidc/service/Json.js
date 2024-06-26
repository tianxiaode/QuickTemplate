Ext.define('Common.oidc.service.Json', {
    alias: 'oidc.service.json',

    requires: [
        'Common.core.util.Logger',
        'Common.core.service.HttpClient'
    ],

    contentTypes: null,
    extraHeaders: null,

    constructor(additionalContentTypes, jwtHandler, extraHeaders) {
        let me = this;
        me.extraHeaders = extraHeaders || {};
        me.contentTypes = [];
        if (additionalContentTypes) {
            me.contentTypes.push(...additionalContentTypes);
        }
        me.contentTypes.push('application/json');
        if (jwtHandler) {
            me.jwtHandler = jwtHandler;
            me.contentTypes.push('application/jwt');
        }
    },

    async getJson(url, token, withCredentials) {
        let me = this,
            headers = me.getHeaders(token),
            response;
        Logger.debug(me.getJson, "url:", url);
        try {
            let options = {headers: headers};
            if(withCredentials) {
                options.withCredentials = true;
            }
            response = await Http.get(url, null, options);        
                
        } catch (error) {
            Logger.debug(me.getJson, 'Error from server:', error) 
            throw new Error(`${error.statusText} (${error.status})`);
        }

        if(response.request.timedout === true){
            throw Oidc.ErrorTimeout.create('Network timed out');
        };

        let contentType = response.getResponseHeader("Content-Type");
        if (contentType && !me.contentTypes.find(item => contentType.startsWith(item))) {
            throw new Error(`Invalid response Content-Type: ${(contentType || "undefined")}, from URL: ${url}`);
        }
        if (response.request.success && me.jwtHandler && (contentType && contentType.startsWith("application/jwt"))) {
            return me.jwtHandler(response.responseText);
        }
        let json = response.request.getJson();
        if(!json) {
            Logger.error(me.getJson, "Error parsing JSON response", response);
            throw new Error(`${response.responseText}`);
        }
        return me.normalizedJson(json);

    },

    async postForm(url, data,  token, withCredentials) {
        let me = this,
            headers = me.getHeaders(token, true),
            response;
        Logger.debug(me.postForm, "url:", url);
        try {
            let options = { data: data, headers: headers};
            if(withCredentials) {
                options.withCredentials = true;
            }
            response = await Http.post(url, data, options);
        }
        catch (error) {
            Logger.debug(me.postForm, 'Error from server:', error);
            if(error.request){
                let err = error.request.getError();
                if(err.message) throw new Error(err.message);
            }
            throw new Error(`${error.statusText} (${error.status})`);
        }

        if(response.request.timedout === true){
            throw Oidc.ErrorTimeout.create('Network timed out');
        };

        Logger.debug(me.postForm, "HTTP response received, status", response.status);
        let contentType = response.getResponseHeader("Content-Type");
        if (contentType && !me.contentTypes.find(item => contentType.startsWith(item))) {
            throw new Error(`Invalid response Content-Type: ${(contentType || "undefined")}, from URL: ${url}`);
        }
        let json = response.request.getJson();
        if(!json) {
            Logger.error(me.postForm, "Error parsing JSON response", response);
            throw new Error(`${response.responseText}`);
        }
        return me.normalizedJson(json);
    },


    destroy() {
        this.destroyMembers('contentTypes', 'extraHeaders', 'jwtHandler');
        this.callParent();
    },


    privates: {

        normalizedJson(json){
            let result = {};
            Ext.each(Object.keys(json),(k)=>{
                result[Format.toCamelCase(k, '_')] = json[k];
            })
            return result;
        },

        async send(options) {
            options.success =function(response) {
                console.log('re-resolve', response)
                Promise.resolve( response)
            }
            options.failure = function(response) {
                console.log('re-failure', response)
                Promise.reject(response)
            }
            console.log('re-options', options)
            Ext.Ajax.request(options);
        },

        getHeaders(token, isPost){
            let me = this,
                headers = { "Accept": me.contentTypes.join(", ")};
            if(isPost){
                headers["Content-Type"] = "application/x-www-form-urlencoded";
            }
            if (token) {
                Logger.debug(me.getHeaders, "token passed, setting Authorization header");
                let authorizationPrefix = isPost ? 'Basic' : 'Bearer';
                headers["Authorization"] = `${authorizationPrefix} ${token}`;
            }
            me.appendExtraHeaders(headers);
            return headers;
        },

        appendExtraHeaders(headers) {
            let me = this,
                extraHeaders = me.extraHeaders,
                customKeys = Object.keys(extraHeaders);
            let protectedHeaders = [
                "authorization",
                "accept",
                "content-type",
            ];
            if (customKeys.length === 0) {
                return;
            }
            customKeys.forEach((headerName) => {
                if (protectedHeaders.includes(headerName.toLocaleLowerCase())) {
                    Logger.warn(me.appendExtraHeaders, "Protected header could not be overridden", headerName, protectedHeaders);
                    return;
                }
                let content = (typeof extraHeaders[headerName] === "function") ?
                    extraHeaders[headerName]() :
                    extraHeaders[headerName];
                if (content && content !== "") {
                    headers[headerName] = content;
                }
            });

        }
    }

});
