Ext.define('Common.mixin.data.Proxy',{
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.data.proxy.Format'
    ],

    mixinConfig: {
        configs: true,
        before:{
            updateProxy: 'updateProxy',
        }
    },

    entity: null,
    controller: null,

    updateProxy(proxy){  
        let me = this,
            model = me.getModel(),
            entityName = model.entityName,
            url = proxy.getUrl();
        if(!Ext.isEmpty(url) && url.substr(1) !== entityName) return;

        let entity = me.entity || entityName,
            controller = me.controller;

        if(controller){
            me.setControllerUrl(proxy, controller);
            return;
        }

        if(Ext.isString(entity)){
            let index = entity.indexOf('.');
            if(index>0) entity = entity.substr(index+1);    
        }
        me.setEntityUrl(proxy, entity);
    },

    setEntityUrl(proxy ,value){
        if(Ext.isEmpty(value)) return value;
        if(Ext.isString(value)){
            proxy.setUrl(URI.crud(value));
        }
        if(Ext.isArray(value)){
            proxy.setUrl(URI.crud.apply(me, value));
        }
    },

    setControllerUrl(proxy, value){
        if(Ext.isEmpty(value)) return value;
        if(Ext.isString(value)){
            proxy.setUrl(URI.get(value));
        }
        if(Ext.isArray(value)){
            let [controller,...actions] = value,
                action = '';
            actions.forEach(m=>{
                action+=`/${m}`;
            })
            proxy.setUrl(URI.get(controller, action.substr(1)));
        }
    },

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


})