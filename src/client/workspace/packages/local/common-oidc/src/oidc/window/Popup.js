
Ext.define('Common.oidc.window.Popup', {
    extend: 'Common.oidc.window.Abstract',
    alias: 'oidc.window.popup',

    checkForPopupClosedInterval: 500,
    second: 1000,

    defaultFeatures: {
        location: false,
        toolbar: false,
        height: 640,
        closePopupWindowAfterInSeconds: -1
    },

    constructor(config) {
        let me = this;
        me.callParent(arguments);
        let features = Ext.apply({}, me.defaultFeatures, config.features),
            centeredPopup = OidcPopup.center(features);

        me.window = window.open(undefined, config.target, OidcPopup.serialize(centeredPopup));
        if (features.closePopupWindowAfterInSeconds && features.closePopupWindowAfterInSeconds > 0) {
            setTimeout(() => {
                if (!me.window || typeof me.window.closed !== "boolean" || me.window.closed) {
                    me.abort.raise("Popup blocked by user");
                    return;
                }

                me.close();
            }, features.closePopupWindowAfterInSeconds * second);
        }

    },

    async navigate(params) {
        let me = this,
            window = me.window;
        window?.focus();

        let popupClosedInterval = setInterval(() => {
            if (!window || window.closed) {
                me.abort.raise("Popup closed by user");
            }
        }, me.checkForPopupClosedInterval);
        me.disposeHandlers.add(() => clearInterval(popupClosedInterval));

        return await me.callParent(arguments);
    },

    close(){
        let me = this,
            window = me.window;
        if (window) {
            if (!window.closed) {
                window.close();
                me.abort.raise("Popup closed");
            }
        }
        me.window = null;
    },

    notifyOpener(url, keepOpen){
        if (!window.opener) {
            Ext.raise("No window.opener. Can't complete notification.");
        }
        return this.notifyParent(window.opener, url, keepOpen);
    },


    destroy() {
        this.destroyMembers('defaultFeatures', 'window');
        this.callParent();
    }
})
