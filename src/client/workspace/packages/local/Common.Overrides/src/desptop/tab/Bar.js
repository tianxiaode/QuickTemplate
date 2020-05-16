Ext.define('Common.Overrides.desktop.tab.Bar', {
    override: 'Ext.tab.Bar',
    config: {
        animateIndicator: false,
        shadow: false,
    },

    platformConfig: {
        desktop: {
            layout: {
                pack: 'left'
            }
        }
    }
});
