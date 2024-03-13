Ext.define('Common.mixin.field.Textarea', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.field.TextArea'
    ],

    config: {
        textareaField: {}
    },

    createTextareaField(config) {
        return Ext.apply({
            xtype: 'textareafield',
            fieldType: 'textarea',
            minHeight: 300,
            hidden: true,
            autoLabel: false,
            ownerCmp: this
        }, config, this.getDefaults())
    },

    applyTextareaField(config, old) {
        return Ext.updateWidget(old, config, this, 'createTextareaField');
    },

    updateTextareaField(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('textareaField');
    }



})
