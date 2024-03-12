Ext.define('Common.mixin.button.Search', {
    extend: 'Common.mixin.Component',

    config: {
        searchButton: null,
        searchButtonDefaults: {
            iconCls: IconCls.search,
            handler: 'onSearchButtonTap',
            handler:'onSearch',
            mixinName: 'searchButton'
        }
    },

    applySearchButton(config, old) {
        return Ext.updateWidget(old, config, this, 'getComponentConfig', 'searchButtonDefaults');
    },

    updateSearchButton(config) {
        config && this.add(config);
    }

})
