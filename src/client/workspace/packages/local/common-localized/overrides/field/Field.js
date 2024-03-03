Ext.define('Common.overrides.field.Field',{
    override: 'Ext.field.Field',

    config:{
        autoLabel: true,
        langLabel: null,
    },


    onLocalized(){
        let me = this;
        me.setRequiredMessage(I18N.get('RequiredMessage'));
        me.setValidationMessage(I18N.get('ValidationMessage'));

        if(me.getAutoLabel() && !me.isCheckbox){
            let name = Format.capitalize(me.getName() || me.getItemId());
            me.setLangLabel(name);
        }

        let label = me.getLocalizedText(me.getLangLabel());
        
        label && me.setLabel(label);

        Ext.platformTags.desktop && me.labelElement.set({title : me.getLabel()});

        me.setError(null);
    },

    updateTipError: function(error) {
        if (error) {
            error = Ext.apply({
                html: error,
                zIndex: 1000,
            }, this.getErrorTip());
        }

        // Using the bodyElement as the target of the qtip ensures that the tip is visually
        // aligned to the field body, regardless of label positioning or bottom padding added
        // by the stylesheet to support $field-vertical-spacing
        this.bodyElement.getData().qtip = error;
    }


})