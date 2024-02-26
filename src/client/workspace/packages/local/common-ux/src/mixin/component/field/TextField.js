Ext.define('Common.mixin.component.field.TextField', {
    extend: 'Common.mixin.Component',

    config: {
        textField: {}
    },


    createTextField(config) {
        return Ext.apply({
            xtype: 'textfield',
            fieldType: 'text',
            hidden: true,
            autoLabel: false,
            ownerCmp: this,
        }, config);
    },

    applyTextField(config, old) {
        return Ext.updateWidget(old, config, this, 'createTextField');
    },

    updateTextField(config){
        config && this.add(config);
    },

    doDestroy() {
        this.setTextField(null);
    }


})
