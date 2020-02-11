Ext.define('Common.Overrides.shared.desktop.field.Field',{
    override: 'Ext.field.Field',

    autoLabel: true,

    initialize: function() {
        var me = this;
        let autoLabel = me.autoLabel;
        if(autoLabel && me.xtype !== 'hiddenfield'){
            let form = me.up('formpanel');
            if(form){
                let entity = form.entityName || form.getEntityName();
                if(Ext.isEmpty(entity)) Ext.raise('No define entityName');
                let label = I18N['Model'][entity][me.getName()];
                if((me.isCheckbox || me.isRadio) && !me.showFieldLabel){
                    me.setBoxLabel(label);
                }else{
                    me.setLabel(label + (Ext.platformTags.phone ? '' : I18N.LabelSeparator));
                }
                if(me.setPlaceholder) {
                    me.setPlaceholder(label);
                }
            }
        }
        
        me.callParent();
 
        if (me.getValue() === '' && me.validateOnInit === 'all') {
            me.validate();
        }    
    },
    
    applyReadOnly: function(value){
        if(value){
            this.element.addCls('x-field-readonly');
        }else{
            this.element.removeCls('x-field-readonly');
        }
        return value;
    }
});