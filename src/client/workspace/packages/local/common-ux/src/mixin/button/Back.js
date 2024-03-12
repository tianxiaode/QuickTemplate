Ext.define('Common.mixin.button.Back', {
    extend: 'Common.mixin.Component',

    config: {
        backButton: null,
        backButtonDefaults: {
            iconCls : IconCls.left,
            mixinName: 'backButton',
            weight : -100,
            scope: 'this',
            ui: 'plain',
            handler: 'onBackButtonTap'
        }
    },

    applyBackButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'backButtonDefaults');
    },

    updateBackButton(config){
        config && this.add(config);
    },

    onBackButtonTap(){
        Ext.History.back();
    }
})
