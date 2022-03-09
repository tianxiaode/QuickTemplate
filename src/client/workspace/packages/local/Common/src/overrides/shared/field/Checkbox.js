Ext.define('Common.overrides.shared.field.Checkbox',{
    override: 'Ext.field.Checkbox',

    config:{
        langBoxLabel: null,
        bodyAlign: 'start'
    },

    isCheckbox: true,

    onLocalized(){
        let me = this,
            resourceName = me.resourceName || me.getContainerResourceName();

        if(me.getAutoLabel()){
            let name = Ext.util.Format.capitalize(me.getName() || me.getItemId());
            me.setLangBoxLabel(name);
        }

        let langBoxLabel = me.getLangBoxLabel();

        if(langBoxLabel){
            me.setBoxLabel(I18N.get(langBoxLabel,resourceName, me.getEntityName()));
        } 
    
        me.callParent();
    },

    getSubmitValue() {
        let me = this,
            unchecked = me.uncheckedValue,
            uncheckedVal = Ext.isDefined(unchecked) ? unchecked : null;        
        return me.getChecked() ? Ext.isEmpty(me._value) ? true : me._value : uncheckedVal;
    },


})