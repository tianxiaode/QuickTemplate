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
            resourceName = me.resourceName || me.getContainerResourceName(),
            html = me.getLangHtml(),
            langTooltip = me.getLangTooltip(),
            text = '';
        if(langTooltip){
            if(Ext.isArray(langTooltip)){
                langTooltip.forEach(t=>{
                    text += I18N.get(t, resourceName)
                })
            }else{
                text =  I18N.get(langTooltip, resourceName)
            }
            me.setTooltip(text);
        }
        if(!html) return;
        text = '';
        if(Ext.isArray(html)){
            text = me.getArrayText(html, true, resourceName);
            me.setHtml(text);
            return;
        }
        text = I18N.get(html, resourceName);
        if(Ext.isArray(text)) text = me.getArrayText(text , false);
        me.setHtml(text);
        

    },

    getContainerResourceName(){
        let me = this;
        let container = me.includeResource ? me : me.up('[includeResource]'),
            vm = container && container.getViewModel();
        
        return (vm && vm.get('resourceName')) || (container && container.resourceName);

    },

    getEntityName(){
        let me = this;
        if(me.entityName) return me.entityName;
        let container = me.up && me.up('[includeResource]');
            vm = container && container.getViewModel();
        return (vm && vm.get('entityName')) || (container && container.entityName);
    },

    getArrayText(text, needLocalized,resourceName){
        let html = [];
        text.forEach(t=>{
            html.push(needLocalized ? I18N.get(t, resourceName) : t);
        })
        return html.join('');
    },


})