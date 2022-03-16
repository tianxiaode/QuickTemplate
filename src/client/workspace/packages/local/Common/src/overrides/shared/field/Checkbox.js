Ext.define('Common.overrides.shared.field.Checkbox',{
    override: 'Ext.field.Checkbox',

    config:{
        langBoxLabel: null,
        bodyAlign: 'start'
    },

    isCheckbox: true,

    onLocalized(){
        let me = this,
            resourceName = me.getResourceName();

        if(me.getAutoLabel()){
            let name = Format.capitalize(me.getName() || me.getItemId());
            me.setLangBoxLabel(name);
        }

        let label = me.getLocalizedText(me.getLangBoxLabel(), resourceName, me.getEntityName());
        
        label && me.setBoxLabel(label);

        me.callParent();
    },

    getSubmitValue() {
        let me = this,
            unchecked = me.uncheckedValue,
            uncheckedVal = Ext.isDefined(unchecked) ? unchecked : null;        
        return me.getChecked() ? Ext.isEmpty(me._value) ? true : me._value : uncheckedVal;
    },


})