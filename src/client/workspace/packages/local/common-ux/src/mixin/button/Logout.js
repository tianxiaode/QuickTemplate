Ext.define('Common.mixin.button.Logout', {
    extend: 'Common.mixin.Component',

    config: {
        logoutButton: null
    },

    createLogoutButton(config) {
        return Ext.apply({
            xtype: 'button',
            ui: 'grey',
            langTooltip: 'Logout',
            bind: { hidden: '{!isAuthenticated}' },
            iconCls: IconCls.logout,
            handler: 'onLogoutButtonTap',
            scope: this,
            ownerCmp: this
        }, config);
    },

    applyLogoutButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createLogoutButton');
    },

    updateLogoutButton(config) {
        config && this.add(config);
    },

    onLogoutButtonTap() {
        Alert.confirm(I18N.get('Logout'), I18N.get('LogoutMessage')).then(() => {
            Config.clearAll();
            Auth.logout();
        })
    },

    doDestroy() {
        this.destroyMembers('logoutButton');
    }


})
