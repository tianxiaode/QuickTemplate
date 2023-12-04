Ext.define('Common.core.service.HttpClient', {
    alternateClassName: 'Http',
    singleton: true,

  
    requires: [
        'Common.core.service.Storage',
        'Common.overrides.data.request.Base'
    ],

    constructor() {
        let me = this;
        Ext.Ajax.setCors(true);
        ['POST', 'PUT', 'GET', 'DELETE', 'PATCH'].forEach(m=>{
            me[m] = m;
        });
        Ext.Ajax.on('beforerequest', me.onAjaxBeforeRequest, me);
    },

    get(url, data, opts) {
        return this.send(url, data, this.GET, opts);
    },

    post(url, data, opts) {
        return this.send(url, data, this.POST, opts);
    },

    put(url, data, opts) {
        return this.send(url, data, this.PUT, opts);
    },

    patch(url, data, opts) {
        return this.send(url, data, this.PATCH, opts);
    },

    delete(url, data, opts) {
        return this.send(url, data, this.DELETE, opts);
    },

    upload(url, data, opts) {
        opts = Ext.apply({
            xhr2:  true,
            rawData : data
        },opts);
        opts.headers = opts.headers || {};
        opts.headers['Content-Type'] = null;

        return this.send(url, data, this.POST, opts);
    },

    download(url, data, opts){
        opts = opts || {};
        opts.binary = true;
        return this.get(url, data, opts);
    },

    postScriptError(msg, url, line, col, error) {
        return Http.post(URI.get('script-errors'), {
            source: url,
            message: msg,
            line: line,
            column: col,
            error: error
        });
    },

    getDefaultHeaders() {
        let lang = AppConfig.lang;
        return {
            'Authorization': 'Bearer ' + AppStorage.get('accessToken'),
            'Access-Control-Allow-Origin': '*',
            "accept-language": AppStorage.get('lang') || (lang === 'zh-CN' ? 'zh-Hans'
                : lang === 'zh-TW' ? 'zh-Hant' : lang)
        };

    },


    send(url, data, method, opts) {
        let me = this,
            options = me.setOptions(url, method, data, opts);
        return Ext.Ajax.request(options)
    },


    privates: {

        setOptions(url, method, data, opts){
            let me = this;
            if(!Ext.isString(url)) url = url.toString() || '';
            opts = Object.assign({}, opts);
            opts.url = url;
            opts.method = method;

            // Add xsrf header
            if(url.startsWith && url.startsWith(window.location.href)){
                let xsrfValue = Ext.util.Cookies.get(me.xsrfCookieName);
                opts.headers = opts.headers || {};
                if (xsrfValue) {
                    opts.headers[me.xsrfHeaderName] = xsrfValue;
                }
            }

            if(opts.xhr2) return opts;

            if(method === 'GET') {
                opts.params = data;
                return opts;
            }

            let contentType = opts.headers && opts.headers['Content-Type'];
            if (contentType && contentType.includes('x-www-form')) {
                opts.rawData = Ext.isString(data) ? data : Ext.Object.toQueryString(data);
            } else {
                opts.jsonData = data;
            }

            return opts;

        },

        onAjaxBeforeRequest(conn, options, eOpts){
            if(!options.headers) options.headers = this.getDefaultHeaders();
        }



    } // privates end




})