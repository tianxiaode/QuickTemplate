Ext.define('Common.ux.data.proxy.Format', {
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
            let [controller,...actions] = value,
                action = '';
            actions.forEach(m=>{
                action+=`/${m}`;
            })
            me.setUrl(URI.get(controller, action.substr(1)));
        }
        return value;
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
