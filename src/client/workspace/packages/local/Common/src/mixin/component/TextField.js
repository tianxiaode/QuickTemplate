Ext.define('Common.mixin.component.TextField', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
    },

    config: {
        text: {
            xtype: 'textfield',
            inputType: 'text',
            hidden: true,
            autoLabel: false,
        },
    },

    hasTextField: true,

    createText(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyText(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createText');
    },

    updateText(config){
        this.hasTextField && config && this.add(config);
    },


})
