Ext.define('Common.mixin.field.TextField', {
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
            ownerCmp: this
        }, config, this.getDefaults())
        
    },

    applyTextField(config, old) {
        return Ext.updateWidget(old, config, this, 'createTextField');
    },

    updateTextField(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('textField');
    }


})
