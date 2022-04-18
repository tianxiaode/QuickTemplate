Ext.define('Common.ux.data.proxy.Format', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.format',

    limitParam: 'maxResultCount',
    startParam: 'skipCount', 
    sortParam: 'sorting',

    encodeSorters(sorters) {
        if(sorters.length === 0) return null;
        let sortStr = [];
        sorters.forEach(s=>{
            sortStr.push(`${s._property} ${s._direction}`);
        })        
        return sortStr.join(",");
    },

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
        exception(proxy,response,options,eOpts){
            let error = Http.getError(response);
            MsgBox.alert(null,error);
        }
    }


})
