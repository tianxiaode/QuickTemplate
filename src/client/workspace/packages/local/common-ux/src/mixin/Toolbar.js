Ext.define('Common.mixin.Toolbar', {
    extend: 'Common.mixin.Component',

    config: {
        toolbar: null,
        toolbarDefaults: {
            xtype: 'toolbar',
            userCls: 'bg-content',
            shadow: false,
            buttonScope: true,
            weighted: true,
            mixinName: 'toolbar'
        }
    },

    applyToolbar(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'toolbarDefaults');
    },

    updateToolbar(config){
        config && this.add(config);
    }

});
