Ext.define('Common.shared.ux.data.proxy.Format', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.format',

    limitParam: 'maxResultCount',
    startParam: 'skipCount', 
    sortParam: 'sorting',

    config:{
        entity: null,
        controller: null,
    },

    encodeSorters(sorters) {
        if(sorters.length === 0) return null;
        let sortStr = [];
        sorters.forEach(s=>{
            sortStr.push(`${s._property} ${s._direction}`);
        })        
        return sortStr.join(",");
    },

    applyEntity(value){
        let me = this;
        if(Ext.isEmpty(value)) return value;
        if(Ext.isString(value)){
            me.setUrl(URI.crud(value));
        }
        if(Ext.isArray(value)){
            // let entity = value[0],
            //     args = value.slice(1);
            me.setUrl(URI.crud.apply(me, value));
        }
        return value;
    },

    applyController(value){
        let me = this;
        if(Ext.isEmpty(value)) return value;
        if(Ext.isString(value)){
            me.setUrl(URI.get(value));
        }
        if(Ext.isArray(value)){
            me.setUrl(URI.get(value[0], value[1] , value[2]));
        }
        return value;
    },

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
        exception(proxy,response,options,eOpts){
            Failure.ajax.apply(proxy,[response, null ,true])
        }
    }


})
