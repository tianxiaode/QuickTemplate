Ext.define('Common.overrides.shared.field.Checkbox',{
    override: 'Ext.field.Checkbox',

    config:{
        langBoxLabel: null
    },

    isCheckbox: true,

    onLocalized(){
        const me = this,
            form = me.up('formpanel'),
            resourceName = me.getResourceName() || (form && form.getResourceName());

        if(me.getAutoLabel()){
            me.setLangBoxLabel(me.getName() || me.getItemId());
        }

        let langBoxLabel = me.getLangBoxLabel();

        if(langBoxLabel) me.setBoxLabel(I18N.get(langBoxLabel, resourceName));
    
        me.callParent();
    }

})