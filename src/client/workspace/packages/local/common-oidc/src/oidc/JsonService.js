Ext.define('Common.oidc.JsonService',{
    alias: 'oidc.jsonservice',

    contentTypes: null,
    extraHeaders: null,

    constructor(config){
        let me = this;
        config = config || {};
        me.extraHeaders = config.extraHeaders || {};
        me.contentTypes = [];
        if(config.additionalContentTypes){
            me.contentTypes.push(...config.additionalContentTypes);
        }
        me.contentTypes.push('application/json');
        if(config.jwtHandler){
            me.contentTypes.push('application/jwt');
        }
    },

    async getJson(options){
        let me = this,
            headers = { "Accept": me.contentTypes.join(", ") },
            response;
        options = options || {};
        if(options.token){
            Logger.debug("token passed, setting Authorization header");
            headers["Authorization"] = "Bearer " + options.token;        
        }
        me.appendExtraHeaders(headers);
        options.headers = headers;
        try {
            Logger.debug("url:", options.url);
            options.method = 'GET';
            response = await Ext.Ajax.request(options);
        }
        catch (err) {
            Logger.error("Network Error");
            throw err;
        }
        Logger.debug("HTTP response received, status", response.status);
        let contentType = response.headers.get("Content-Type");
        if (contentType && !me.contentTypes.find(item => contentType.startsWith(item))) {
            throw new Error(`Invalid response Content-Type: ${(contentType ?? "undefined")}, from URL: ${url}`);
        }
        if (response.ok && me.jwtHandler && contentType?.startsWith("application/jwt")) {
            return await me.jwtHandler(response.responseText);
        }
        let json;
        try {
            json = await response.getJson();
        }
        catch (err) {
            Logger.error("Error parsing JSON response", err);
            if (response.ok) throw err;
            throw new Error(`${response.statusText} (${response.status})`);
        }
        if (!response.ok) {
            Logger.error("Error from server:", json);
            if (json.error) {
                throw new Error(json);
            }
            throw new Error(`${response.statusText} (${response.status}): ${JSON.stringify(json)}`);
        }
        return json;

    },

    async postForm(options){
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
            Logger.error("Network error");
            throw err;
        }

        Logger.debug("HTTP response received, status", response.status);
        let contentType = response.headers.get("Content-Type");
        if (contentType && !me.contentTypes.find(item => contentType.startsWith(item))) {
            throw new Error(`Invalid response Content-Type: ${(contentType ?? "undefined")}, from URL: ${options.url}`);
        }

        let responseText = await response.responseText;

        let json= {};
        if (responseText) {
            try {
                json = JSON.parse(responseText);
            }
            catch (err) {
                Logger.error("Error parsing JSON response", err);
                if (response.ok) throw err;
                throw new Error(`${response.statusText} (${response.status})`);
            }
        }

        if (!response.ok) {
            Logger.error("Error from server:", json);
            if (json.error) {
                throw new ErrorResponse(json, body);
            }
            throw new Error(`${response.statusText} (${response.status}): ${JSON.stringify(json)}`);
        }

        return json;
    },

    destroy() {
        this.destroyMembers('contentTypes', 'extraHeaders');
        this.callParent();
    },


    privates:{

        appendExtraHeaders(headers){
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
                    Logger.warn("Protected header could not be overridden", headerName, protectedHeaders);
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
