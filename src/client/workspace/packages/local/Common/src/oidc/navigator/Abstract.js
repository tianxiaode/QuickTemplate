Ext.define('Common.oidc.navigator.Abstract', {

    constructor(config) {
        let me = this;
        Ext.apply(this, config);
    },

    prepare(){},

    callback(){},

    destroy() {
        this.destroyMembers('settings', 'window');
        this.callParent();
    }


})
  