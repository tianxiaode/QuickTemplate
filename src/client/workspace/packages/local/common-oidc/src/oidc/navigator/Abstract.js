Ext.define('Common.oidc.navigator.Abstract', {

    constructor(settings) {
        this.settings = settings;
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
  