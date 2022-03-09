Ext.define('Common.overrides.shared.field.Field',{
    override: 'Ext.field.Field',

    config:{
        autoLabel: true,
        langLabel: null,
    },

    onLocalized(){
        let me = this,
            resourceName = me.resourceName || me.getContainerResourceName();
        me.setRequiredMessage(I18N.get('RequiredMessage'));
        me.setValidationMessage(I18N.get('ValidationMessage'));

        if(me.getAutoLabel() && !me.isCheckbox){
            let name = Ext.util.Format.capitalize(me.getName() || me.getItemId());
            me.setLangLabel(name);
        }

        let langLabel = me.getLangLabel();

        if(langLabel) {
            me.setLabel(I18N.get(langLabel, resourceName, me.getEntityName()));
            if(Ext.platformTags.desktop)me.labelElement.set({title : me.getLabel()});
        }

        me.setError(null);
    },

})