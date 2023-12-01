Ext.define('Common.overrides.Component',{
    override: 'Ext.Component',

    mixins: [
        'Ext.mixin.Responsive'
    ],

    config:{
        langHtml: null,
        langTooltip: null,
        resourceName: null,        
    },

    applyResourceName(value){
        this.includeResource = !!value;
        return value;
    },


    initialize(){
        let me = this,
            i18n = window.I18N;
        me.callParent(arguments);
        if(!i18n){
            Ext.defer(me.initialize, 50, me );
            return;
        }
        if(i18n.isReady){
            me.onLocalized();
        }
        i18n.on('ready', me.onLocalized, me);
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
    }



})