Ext.define('Common.mixin.component.field.Textarea', {
    extend: 'Common.mixin.component.Base',

    requires: [
        'Ext.field.TextArea'
    ],

    config: {
        textarea: {}
    },


    createTextarea(config) {
        return Ext.apply({
            xtype: 'textareafield',
            fieldType: 'textarea',
            minHeight: 300,
            hidden: true,
            autoLabel: false,
            ownerCmp: this,
        }, config);
    },

    applyTextarea(config, old) {
        return Ext.updateWidget(old, config, this, 'createTextarea');
    },

    updateTextarea(config) {
        config && this.add(config);
    },

    destroy() {
        this.setTextarea(null);
    }



})
