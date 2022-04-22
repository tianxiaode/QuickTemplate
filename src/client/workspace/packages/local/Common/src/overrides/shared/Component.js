Ext.define('Common.overrides.shared.Component',{
    override: 'Ext.Component',

    config:{
        langHtml: null,
        langTooltip: null,
        resourceName: null,        
        entityName: null,
    },

    applyResourceName(value){
        this.includeResource = !!value;
        return value;
    },

    updateEntityName(){
        !this.isInitPermissions && this.initPermissions();
    },

    updateResourceName(){
        !this.isInitPermissions && this.initPermissions();
    },


    initialize(){
        let me = this;
        me.callParent(arguments);
        if(I18N && I18N.isReady){
            me.onLocalized();
        }
        Ext.on('i18nready', me.onLocalized, me);
    },

    onLocalized(){
        let me = this,
            resourceName = me.getResourceName(),
            entityName = me.getEntityName(),
            text = me.getLocalizedText(me.getLangTooltip(), resourceName, entityName);

        text && me.setTooltip(text);

        text = me.getLocalizedText(me.getLangHtml(), resourceName, entityName);

        text && me.setHtml(text);
    },

    getResourceName(){
        let me = this,
            container = me.getResourceContainer();
        return me._resourceName || (container && container._resourceName);
    },

    getEntityName(){
        let me = this,
            container = me.getResourceContainer();
        return me._entityName || (container && container._entityName);
    },

    getPermissions(){
        let me = this,
            container = me.getResourceContainer();
        return me.permissions || (container && container.permissions);
    },

    initPermissions(){
        let me = this,
            entityName = me._entityName,
            resourceName = me._resourceName,
            group = me.permissionGroup || resourceName,
            permissionName = me.permissionName || entityName,
            permissions= {};
        //console.log('initPermissions', me.xtype, group, permissionName);
        if(Ext.isEmpty(permissionName) || Ext.isEmpty(group)) return;
        Ext.isArray(me.permissions) && me.setPermissions(permissions, me.permissions, group, permissionName);
        me.setPermissions(permissions, Format.defaultPermissions, group, permissionName);
        me.permissions = permissions;
        me.isInitPermissions = true;
        //console.log(me.permissions)
    },

    setPermissions(permissions,actions, group , permissionName){
        actions.forEach(a=>{
            if(permissions[a]) return;
            let permission = `${group}.${Format.pluralize(permissionName) }.${a}`;
            permissions[a.toLowerCase()] = ACL.isGranted(permission);
        })
    },

    getResourceContainer(){
        return this.up('[includeResource]');
    },

    getLocalizedText(text, resourceName, entityName){
        if(!text) return null;
        let isArray = Ext.isArray(text);
        text = isArray ? this.getArrayText(text, true, resourceName, entityName)
            : I18N.get(text, resourceName, entityName);
        return text;
    },

    getArrayText(text, needLocalized,resourceName, entityName){
        let html = [];
        text.forEach(t=>{
            html.push(needLocalized ? I18N.get(t, resourceName, entityName) : t);
        })
        return html.join('');
    },

    isPhone(){
        return Ext.platformTags.phone;
    },

    responsiveFormulas:{
        cancel(context){
            return this.initialConfig.cancelResponsive;
        }
    }

})