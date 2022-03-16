Ext.define('Common.overrides.shared.field.Text',{
    override: 'Ext.field.Text',

    config:{
        langBadFormatMessage: null,
        langPlaceholder: null
    },

    onLocalized(){
        let me = this,
            badFormatMessage = me.getLangBadFormatMessage(),
            text = me.getLangPlaceholder(),
            resourceName = me.getResourceName(),
            entityName = me.getEntityName();

        text = me.getLocalizedText(text, resourceName, entityName);
    
        text && me.setPlaceholder(text);

        if(!badFormatMessage){
            me.setLangBadFormatMessage(me.badFormatMessage);
        }
        me.badFormatMessage = I18N.get(me.getLangBadFormatMessage());
        me.callParent();
    },

    initialize(){
        let me = this;
        me.callParent(arguments);
        me.initUi();
    },

    initUi(){
        let me = this,
            parent = me.up();
        if(Ext.platformTags.phone && (parent && parent.isToolbar)){
            me.setUi('solo');
        }
    }


})