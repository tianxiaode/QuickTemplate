Ext.define('Common.core.mixin.data.Store',{
    extend: 'Ext.Mixin',

    requires:[
        'Common.core.service.Url'
    ],

    mixinConfig: {
        config: true,
        before:{
            applyModel: 'applyModel',
            updateProxy: 'updateProxy',
            destroy: 'destroy'
        }
    },

    messageField: null,
    url: null,
    localFilterFields: null,
    langText: null,

    config:{
        entityName: null
    },

    applyModel(model) {
        let me = this,
            m = model;
        if(Ext.isEmpty(m)) return model;
        m = Ext.data.schema.Schema.lookupEntity(m);
        me.createEntityName(m.prototype.alias);

        let fields = m.getFields();
        me.localFilterFields =[];
        me.sortFields = {};
        me.langText = {};
        fields.forEach(field => {
            if(field.messageField) me.messageField = field.name;
            if(field.localFilter) me.localFilterFields.push(field.name);
            if(field.allowSort) me.sortFields[field.name] = true;
            if(field.langText) me.langText[field.name] = field.langText;
        });
        return model;
    },

    createEntityName(alias){
        let me = this;
        alias = (Ext.isArray(alias) && alias.find(m=>m.startsWith('entity.'))) || null;
        if(!alias){
            Ext.Logger.error('没有定义以entity.开头别名，无法生成实体名（entityName）');
            return;
        }
        let names = alias.split('.');
        me.setEntityName(names.slice(1));
    },

    updateProxy(proxy){  
        let me = this,
            url = me.url;
        if(url === false) return;
        if(Ext.isArray(url)){
            proxy.setUrl(URI.get.apply(null, url));
            return;
        }
        let entityName = me.getEntityName(),
            ln = entityName.length;
        if(!entityName) return;
        let args, last;
        if(ln > 1){
            last = entityName[ln-1];
            args = [ ...entityName.slice(0,ln-1), Ext.util.Inflector.pluralize(last)];
        }else{
            args = [ Ext.util.Inflector.pluralize(entityName[0]) ];
        }
        proxy.setUrl(URI.get(...args));

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
    },

    destroy(){
        this.destroyMembers('url', 'localFilterFields', 'sortFields', 'langText', 'entityName');
    }


})