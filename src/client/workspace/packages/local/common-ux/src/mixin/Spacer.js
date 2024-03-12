Ext.define('Common.mixin.Spacer', {
    extend: 'Common.mixin.Component',

    requires:[
        'Ext.Spacer'
    ],

    config: {
        spacer: null,
        spacerDefaults: {
            xtype:'spacer',
            mixinName: 'spacer'
        }
    },

    applySpacer(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'spacerDefaults');
    },

    updateSpacer(config){
        config && this.add(config);
    }

});
