Ext.define('Common.overrides.Component',{
    override: 'Ext.Component',

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
            text = me.getLocalizedText(me.getLangTooltip());

        text && me.setTooltip(text);

        text = me.getLocalizedText(me.getLangHtml());

        text && me.setHtml(text);
    },

    getResourceName(){
        let me = this,
            container = me.up('[_resourceName]');
        return me._resourceName || (container && container._resourceName);
    },

    getLocalizedText(text){
        let me = this,
            resourceName = me.getResourceName(),
            entityName = me.getEntityName(),
            html = [];
        if(!text) return '';
        if(Ext.isString(text)) text = [text];
        Ext.each(text, t=>{
            let localizedText = I18N.get(t, resourceName, entityName);
            if(Ext.isArray(localizedText)){
                Ext.each(localizedText, l=>{
                    html.push(I18N.get(l, resourceName, entityName));
                });
                return;
            }
            html.push(localizedText);
        })
        return html.join('');
    }


})