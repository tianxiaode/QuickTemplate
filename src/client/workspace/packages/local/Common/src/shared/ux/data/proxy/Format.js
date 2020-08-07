Ext.define('Common.shared.ux.data.proxy.Format', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.format',

    limitParam: 'maxResultCount',
    startParam: 'skipCount', 
    sortParam: 'sorting',

    reader: {
        type: 'json',
        rootProperty: "items",
        messageProperty: "msg",
        totalProperty: 'totalCount'
    },

    writer: {
        type: "json",
        encode: true,
        rootProperty: "data",
        allowSingle: false
    },

    listeners: {
        exception: function(proxy,response,options,eOpts){
            Failure.ajax.apply(proxy,[response])
        }
    }


})
