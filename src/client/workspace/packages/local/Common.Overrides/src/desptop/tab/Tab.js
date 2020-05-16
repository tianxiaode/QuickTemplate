Ext.define('Common.Overrides.desktop.tab.Tab', {
    override: 'Ext.tab.Tab',
    config: {
        iconAlign: 'left',
    },

    platformConfig: {
        desktop: {
            maxWidth: 150
        }
    }
});
