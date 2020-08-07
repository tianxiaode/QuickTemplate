Ext.define('Common.overrides.shared.field.Field',{
    override: 'Ext.field.Field',

    config:{
        autoLabel: true,
        langLabel: null,
    },

    onLocalized(){
        const me = this,
            form = me.up('formpanel'),            
            resourceName = me.getResourceName() || (form && form.getResourceName());
        me.setRequiredMessage(I18N.get('RequiredMessage'));
        me.setValidationMessage(I18N.get('ValidationMessage'));

        if(me.getAutoLabel() && !me.isCheckbox){
            const name = Ext.util.Format.capitalize(me.getName() || me.getItemId());
            me.setLangLabel(name);
        }

        let langLabel = me.getLangLabel();
        console.log(langLabel)
        if(langLabel) me.setLabel(I18N.get(langLabel, resourceName));    

        me.setError(null);
}

})