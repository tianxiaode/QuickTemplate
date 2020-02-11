Ext.define('Common.Overrides.shared.form.Panel',{
    override: 'Ext.form.Panel',


    privates:{
        beforeAjaxSubmit: function (form, options, successFn, failureFn) {
            var me = this,
                url = options.url || me.getUrl(),
                request = Ext.merge({}, {
                    url: url,
                    timeout: me.getTimeout() * 1000,
                    form: form,
                    scope: me
                }, options);

            delete request.success;
            delete request.failure;

            request.params = Ext.merge(me.getBaseParams() || {}, options.params);
            request.header = Ext.apply({
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }, options.headers || {});

            request.callback = function (callbackOptions, success, response) {
                var responseText = response.responseText,
                    responseXML = response.responseXML,
                    statusResult = Ext.data.request.Ajax.parseStatus(response.status, response);

                if (form.$fileswap) {
                    var original, placeholder;

                    Ext.each(form.$fileswap, function (item) {
                        original = item.original;
                        placeholder = item.placeholder;

                        placeholder.parentNode.insertBefore(original, placeholder.nextSibling);
                        placeholder.parentNode.removeChild(placeholder);
                    });

                    form.$fileswap = null;
                    delete form.$fileswap;
                }

                me.setMasked(false);

                if (response.success === false) {
                    success = false;
                }

                if (success) {
                    if (statusResult && responseText && responseText.length === 0) {
                        success = true;
                    } else {
                        if (!Ext.isEmpty(response.responseBytes)) {
                            success = statusResult.success;
                        } else {
                            if (Ext.isString(responseText) && response.request.options.responseType === "text") {
                                response.success = true;
                            } else if (Ext.isString(responseText)) {
                                try {
                                    response = Ext.decode(responseText);
                                } catch (e) {
                                    response.success = false;
                                    response.error = e;
                                    response.message = e.message;
                                }
                            } else if (Ext.isSimpleObject(responseText)) {
                                response = responseText;
                                Ext.applyIf(response, {success: true});
                            }

                            if (!Ext.isEmpty(responseXML)) {
                                response.success = true;
                            }
                            success = !!response.success;
                        }
                    }
                    if (success) {
                        successFn(response, responseText);
                    } else {
                        failureFn(response, responseText);
                    }
                }
                else {
                    failureFn(response, responseText);
                }
            };

            if (Ext.feature.has.XHR2 && request.xhr2) {
                delete request.form;

                //将data修改为rawData，解决不能xhr2提交问题
                var formData = request.rawData = new FormData(form);

                if (request.params) {
                    Ext.iterate(request.params, function (name, value) {
                        if (Ext.isArray(value)) {
                            Ext.each(value, function (v) {
                                formData.append(name, v);
                            });
                        } else {
                            formData.append(name, value);
                        }
                    });

                    delete request.params;
                }
            }

            return Ext.Ajax.request(request);
        },
    },

    load: function (options) {
        options = options || {};
 
        var me = this,
            api = me.getApi(),
            url = options.url || me.getUrl(),
            waitMsg = options.waitMsg,
            successFn = function (response, data) {
                me.setValues(data.data);
 
                if (Ext.isFunction(options.success)) {
                    options.success.call(options.scope || me, me, response, data);
                }
 
                me.fireEvent('load', me, response);
            },
            failureFn = function (response, data) {
                if (Ext.isFunction(options.failure)) {
                    options.failure.call(options.scope, me, response, data);
                }
 
                me.fireEvent('exception', me, response);
            },
            load, args;
 
        if (options.waitMsg) {
            if (typeof waitMsg === 'string') {
                waitMsg = {
                    xtype   : 'loadmask',
                    message : waitMsg
                };
            }
 
            me.setMasked(waitMsg);
        }
 
        if (api) {
            api = Ext.direct.Manager.resolveApi(api, me);
            me.setApi(api);
 
            load = api.load;
 
            if (!load) {
                Ext.raise("Cannot find Ext Direct API method for load action");
            }
 
            args = load.$directCfg.method.getArgs({
                params: me.getParams(options.params),
                paramOrder: me.getParamOrder(),
                paramsAsHash: me.getParamsAsHash(),
                scope: me,
                callback: function (data, response, success) {
                    me.setMasked(false);
 
                    if (success) {
                        successFn(response, data);
                    } else {
                        failureFn(response, data);
                    }
                }
            });
 
            load.apply(window, args);
        }
        else if (url) {
            return Ext.Ajax.request({
                url: url,
                timeout: (options.timeout || me.getTimeout()) * 1000,
                method: options.method || 'GET',
                params: me.getParams(options.params),
                autoAbort: options.autoAbort,
                headers: Ext.apply(
                    {
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    options.headers || {}
                ),
                callback: function (callbackOptions, success, response) {
                    var responseText = response.responseText,
                        statusResult = Ext.data.request.Ajax.parseStatus(response.status, response);
 
                    me.setMasked(false);
 
                    if (success) {
                        if (statusResult && responseText.length === 0) {
                            success = true;
                        } else {
                            response = Ext.decode(responseText);
                            success = !!response.success;
                        }
 
                        if (success) {
                            successFn(response, responseText);
                        } else {
                            failureFn(response, responseText);
                        }
                    }
                    else {
                        failureFn(response, responseText);
                    }
                }
            });
        }
    },
 
 
});