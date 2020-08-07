Ext.define('Common.overrides.shared.Component',{
    override: 'Ext.Component',

    config:{
        resourceName: null,
        langHtml: null
    },

    initialize(){
        const me = this;
        me.callParent(arguments);
        if(I18N && I18N.isReady){
            me.onLocalized();
        }
        Ext.on('i18nready', me.onLocalized, me);
    },

    onLocalized(){
        const me = this,
            resourceName = me.getResourceName(),
            html = me.getLangHtml();
        if(!html) return;
        me.setHtml(I18N.get(html, resourceName));
    },



})