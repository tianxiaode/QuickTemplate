Ext.define('Common.overrides.shared.field.Field',{
    override: 'Ext.field.Field',

    config:{
        autoLabel: true,
        langLabel: null,
    },

    onLocalized(){
        let me = this,
            resourceName = me.getResourceName();
        me.setRequiredMessage(I18N.get('RequiredMessage'));
        me.setValidationMessage(I18N.get('ValidationMessage'));

        if(me.getAutoLabel() && !me.isCheckbox){
            let name = Format.capitalize(me.getName() || me.getItemId());
            me.setLangLabel(name);
        }

        let label = me.getLocalizedText(me.getLangLabel(), resourceName, me.getEntityName());
        
        label && me.setLabel(label);

        Ext.platformTags.desktop && me.labelElement.set({title : me.getLabel()});

        me.setError(null);
    },

})