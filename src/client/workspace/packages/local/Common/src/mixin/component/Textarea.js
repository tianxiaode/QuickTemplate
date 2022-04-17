Ext.define('Common.mixin.component.Textarea', {
    extend: 'Ext.Mixin',

    requires:[
        'Ext.field.TextArea'
    ],

    mixinConfig: {
        configs: true,
    },

    config: {
        textarea: {
            xtype: 'textareafield',
            fieldType: 'textarea',
            minHeight: 300,
            hidden: true,
            autoLabel: false,
        },
    },

    hasTextarea: false,

    createTextarea(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyTextarea(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createTextarea');
    },

    updateTextarea(config){
        this.hasTextarea && config && this.add(config);
    },


})
