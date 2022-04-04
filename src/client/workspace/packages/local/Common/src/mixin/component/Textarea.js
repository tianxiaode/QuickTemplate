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
            inputType: 'textarea',
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
