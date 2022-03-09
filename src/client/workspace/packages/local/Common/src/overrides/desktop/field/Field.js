Ext.define('Common.overrides.desktop.field.Field',{
    override: 'Ext.field.Field',

    config: {
        labelAlign: 'left'
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
    },

});