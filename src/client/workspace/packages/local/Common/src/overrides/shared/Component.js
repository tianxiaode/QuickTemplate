Ext.define('Common.overrides.shared.Component',{
    override: 'Ext.Component',

    config:{
        langHtml: null,
        langTooltip: null
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
            text = me.getLocalizedText(me.getLangTooltip(), resourceName);

        text && me.setTooltip(text);

        text = me.getLocalizedText(me.getLangHtml(), resourceName);

        text && me.setHtml(text);
    },

    getResourceName(){
        return this.resourceName || this.getContainerResource('resourceName');
    },

    getEntityName(){
        return this.entityName || this.getContainerResource('entityName');
    },

    getContainerResource(name){
        let me = this,
            container = (me.includeResource && me) || (me.up && me.up('[includeResource]')),
            vm = container && container.getViewModel();
        return (vm && vm.get(name)) || (container && container[name]);

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


})