Ext.define('Common.oidc.navigator.Abstract', {

    constructor(config) {
        Ext.apply(this, config);
    },

    settings: null,
    window: null,

    prepare(){},

    callback(){},

    destroy() {
        this.destroyMembers('settings', 'window');
        this.callParent();
    }


})
  