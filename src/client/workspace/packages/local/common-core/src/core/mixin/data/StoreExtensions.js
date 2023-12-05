Ext.define('Common.core.mixin.data.StoreExtensions',{
    extend: 'Ext.Mixin',

    requires:[        
        'Common.core.service.Url'
    ],

    mixinConfig: {
        config: true,
        before:{
            destroy: 'destroy',
            updateModel: 'updateModel'
        }
    },

    messageField: null,
    url: null,
    localFilterFields: null,
    langText: null,

    config:{
        entityName: null,
        resourceName: null
    },

    /**
     * messageField: 记录用于显示模型信息的字段
     * loaclFilter: 记录哪些字段用于本地搜索
     * allowSort: 记录哪些字段允许排序
     * langText: 记录字段的本地化文本
     * @param {Model} model 
     * @returns 
     */
    updateModel(model) {
        let me = this,
            fields = model.getFields();
        me.parseEntityName(model.prototype.alias);
        me.setProxyUrl();
        me.localFilterFields =new Set();
        me.sortFields = new Set();
        me.langText = new Map();
        fields.forEach(field => {
            let name = field.name;
            if(field.messageField) me.messageField = name;
            if(field.localFilter) me.localFilterFields.add(name);
            if(field.allowSort) me.sortFields.add(name);
            if(field.langText) me.langText.set(name, field.langText);
        });
    },

    /**
     * 根据别名解释出entityName
     * 别名定义以entity.为前缀
     * 示例：
     * entity.user: 解释后的entityName的值为['user']
     * entity.identity.user: 解释后的entityName为['identity', 'user']
     * @param {Model别名} alias 
     * @returns 
     */
    parseEntityName(alias){
        let me = this;
        alias = (Ext.isArray(alias) && alias.find(m=>m.startsWith('entity.'))) || null;
        if(!alias){
            Logger.error(me.parseEntityName, '没有定义以entity.开头别名，无法生成实体名（entityName）');
            return;
        }
        let names = alias.replace('entity.', '').split('.'),
            entityName = names.pop();

        me.setResourceName(names.join('.'));
        me.setEntityName(entityName);
    },

    /**
     * 根据url为proxy设置url
     * 如果url为false，则不设置
     * 如果url为数组，则调用URI获取url
     * 如果不设置或设置为null，则使用entiyName创建url
     * @param {Proxy} proxy 
     * @returns 
     */

    setProxyUrl(){  
        let me = this,
            proxy = me.getProxy(),
            url = me.url;
        if(url === false) return;
        if(Ext.isArray(url)){
            proxy.setUrl(URI.get.apply(null, url));
            return;
        }
        let entityName = me.getEntityName();
        if(!entityName) return;
        proxy.setUrl(URI.get(Ext.util.Inflector.pluralize(entityName)));
    },

    /**
     * 设置proxy的参数
     * @returns 
     */

    setExtraParams(){
        let proxy = this.getProxy();
        if(!proxy) return;
        let extraParams = proxy.getExtraParams() || {},
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
        proxy.setExtraParams(extraParams);
    },

    destroy(){
        this.destroyMembers('url', 'localFilterFields', 'sortFields', 'langText', 'entityName', 'resourceName');
    }


})