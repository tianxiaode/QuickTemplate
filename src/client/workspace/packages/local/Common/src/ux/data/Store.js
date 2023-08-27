Ext.define('Common.ux.data.Store', {
    extend: 'Ext.data.Store',
    alias: 'store.uxformatstore',

    mixins:[
        'Common.ux.data.mixin.Model',
        'Common.ux.data.mixin.Proxy'
    ],

    remoteSort: true,
    remoteFilter: true,
    filterValue: null,
    pageSize: 25,

    proxy: 'format',

    setExtraParams(){
        let proxy = this.getProxy();
        if(!proxy) return;
        let extraParams = proxy.extraParams,
            key = arguments[0],
            params = {},
            value, isClear;
        if(Ext.isString(key)){
            value = arguments[1];
            isClear = arguments[2];
            params[key] = value;
        }else if(Ext.isObject(key)){
            params = key;
            isClear = arguments[1];
        }else{
            params = null;
        }
        if(!params) return;
        if(isClear === true) Ext.Object.clear(extraParams);
        extraParams = Ext.apply(extraParams, params);
    }

});
