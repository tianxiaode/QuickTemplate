Ext.define('Common.overrides.shared.field.Text',{
    override: 'Ext.field.Text',

    config:{
        langBadFormatMessage: null,
        langPlaceholder: null
    },

    onLocalized(){
        const me = this,
            form = me.up('formpanel'),
            badFormatMessage = me.getLangBadFormatMessage(),
            placeholder = me.getLangPlaceholder(),
            resourceName = me.getResourceName() || (form && form.getResourceName());
        
        if(placeholder){
            me.setPlaceholder(I18N.get(placeholder, resourceName));
        }

        if(!badFormatMessage){
            me.setLangBadFormatMessage(me.badFormatMessage);
        }
        me.badFormatMessage = I18N.get(me.getLangBadFormatMessage());
        me.callParent();
    }

})