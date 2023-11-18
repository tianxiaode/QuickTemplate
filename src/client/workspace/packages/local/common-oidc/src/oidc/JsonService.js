Ext.define('Common.oidc.JsonService', {
    alias: 'oidc.jsonservice',

    requires: [
        'Common.core.util.Logger',
        'Common.core.service.HttpClient'
    ],

    contentTypes: null,
    extraHeaders: null,

    constructor(config) {
        let me = this;
        config = config || {};
        me.extraHeaders = config.extraHeaders || {};
        me.contentTypes = [];
        if (config.additionalContentTypes) {
            me.contentTypes.push(...config.additionalContentTypes);
        }
        me.contentTypes.push('application/json');
        if (config.jwtHandler) {
            me.jwtHandler = config.jwtHandler;
            me.contentTypes.push('application/jwt');
        }
    },

    async getJson(url, token) {
        let me = this,
            headers = { "Accept": me.contentTypes.join(", ") };
        if (token) {
            Logger.debug(me, "token passed, setting Authorization header");
            headers["Authorization"] = "Bearer " + token;
        }
        me.appendExtraHeaders(headers);
        Logger.debug(me, "url:", url);
        try {
            response = await Http.get(url, null, {headers: headers});        
            console.log('response', response)
                
        } catch (error) {
            Logger.debug(me, 'Error from server:', error) 
            throw new Error(`${error.statusText} (${error.status})`);
        }
        let contentType = response.getResponseHeader("Content-Type");
        if (contentType && !me.contentTypes.find(item => contentType.startsWith(item))) {
            throw new Error(`Invalid response Content-Type: ${(contentType ?? "undefined")}, from URL: ${url}`);
        }
        console.log('response', response.request.success, me.jwtHandler, contentType)
        if (response.request.success && me.jwtHandler && contentType?.startsWith("application/jwt")) {
            return me.jwtHandler(response.responseText);
        }
        let json = response.request.getJson();
        console.log('json', json)
        if(!json) {
            Logger.error(me, "Error parsing JSON response", response);
            throw new Error(`${response.responseText}`);
        }
        return json;

    },

    async postForm(options) {
        let me = this,
            headers = {
                "Accept": me.contentTypes.join(", "),
                "Content-Type": "application/x-www-form-urlencoded"
            };
        if (options.basicAuth !== undefined) {
            headers["Authorization"] = "Basic " + options.basicAuth;
        }

        me.appendExtraHeaders(headers);

        let response;
        try {
            Logger.debug("url:", url);
            options.method = 'POST';
            response = Ext.Ajax.request(options);
        }
        catch (err) {
            Logger.error(me, "Network error");
            throw err;
        }

        Logger.debug(me, "HTTP response received, status", response.status);
        let contentType = response.headers.get("Content-Type");
        if (contentType && !me.contentTypes.find(item => contentType.startsWith(item))) {
            throw new Error(`Invalid response Content-Type: ${(contentType ?? "undefined")}, from URL: ${options.url}`);
        }

        let responseText = response.responseText;

        let json = {};
        if (responseText) {
            try {
                json = JSON.parse(responseText);
            }
            catch (err) {
                Logger.error(me, "Error parsing JSON response", err);
                if (response.ok) throw err;
                throw new Error(`${response.statusText} (${response.status})`);
            }
        }

        if (!response.ok) {
            Logger.error(me, "Error from server:", json);
            if (json.error) {
                throw new ErrorResponse(json, body);
            }
            throw new Error(`${response.statusText} (${response.status}): ${JSON.stringify(json)}`);
        }

        return json;
    },

    destroy() {
        this.destroyMembers('contentTypes', 'extraHeaders', 'jwtHandler');
        this.callParent();
    },


    privates: {

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

        appendExtraHeaders(headers) {
            let me = this,
                customKeys = Object.keys(me.extraHeaders);
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
                    Logger.warn(me, "Protected header could not be overridden", headerName, protectedHeaders);
                    return;
                }
                let content = (typeof me.extraHeaders[headerName] === "function") ?
                    me.extraHeaders[headerName]() :
                    me.extraHeaders[headerName];
                if (content && content !== "") {
                    headers[headerName] = content;
                }
            });

        }
    }

});
