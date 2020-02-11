/**
 * 格式化代理
 */
Ext.define('Common.Shared.ux.data.proxy.Format', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.format',

    requires:[
        'Common.Shared.util.Failed'
    ],

    limitParam: 'MaxResultCount',
    startParam: 'SkipCount', 
    sortParam: 'Sorting',

    reader: {
        type: 'json',
        rootProperty: "result.items",
        messageProperty: "msg",
        totalProperty: 'result.totalCount'
    },

    writer: {
        type: "json",
        encode: true,
        rootProperty: "data",
        allowSingle: false
    },

    listeners: {
        exception: function(proxy,response,options,eOpts){
            FAILED.proxy(proxy,response,options,eOpts)
        }
    }


})
