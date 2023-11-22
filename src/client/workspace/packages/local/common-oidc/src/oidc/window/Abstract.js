
Ext.define('Common.oidc.window.Abstract', {
    requires: [
        'Common.oidc.event.Event',
        'Common.core.util.Logger'
    ],

    /**
    * Window implementation which resolves via communication from a child window
    * via the `Window.postMessage()` interface.
    *
    * @internal
    */


    statics:{
        MessageSource: "oidc-client",
        notifyParent(parent, url, keepOpen, targetOrigin) {
            targetOrigin = targetOrigin ?? this.getLocationOrigin();
            parent.postMessage({
                source: this.MessageSource,
                url,
                keepOpen,
            }, targetOrigin);
        },

        /**
         * 测试用
         */
        getLocationOrigin() {
            return window.location.origin;
        },

        getWindowParent(){
            return window.parent;
        }
    },

    constructor(config) {
        let me = this;
        Ext.apply(this, config);
        me.disposeHandlers = new Set();
        me.abort = Ext.create('oidc.event.event');
    },

    async navigate(params) {
        let me = this;
        if (!me.window) {
            throw new Error("Attempted to navigate on a disposed window");
        }

        Logger.debug(me.navigate, "setting URL in window");
        me.window.location.replace(params.url);

        let { url, keepOpen } = await new Promise((resolve, reject) => {
            let listener = (e) => {
                let data = e.data,
                    origin = params.scriptOrigin ?? Oidc.Window.getLocationOrigin();
                if (e.origin !== origin || data?.source !== Oidc.Window.MessageSource) {
                    // silently discard events not intended for us
                    return;
                }
                try {
                    let state = URI.readParams(data.url, params.responseMode).get("state");
                    if (!state) {
                        Logger.warn(me.navigate, "no state found in response url");
                    }
                    if (e.source !== me.window && state !== params.state) {

                        // MessageEvent source is a relatively modern feature, we can't rely on it
                        // so we also inspect the payload for a matching state key as an alternative
                        return;
                    }
                }
                catch (err) {
                    me.dispose();
                    reject("Invalid response from window");
                }
                resolve(data);
            };
            window.addEventListener("message", listener, false);
            me.disposeHandlers.add(() => window.removeEventListener("message", listener, false));
            me.disposeHandlers.add(me.abort.addHandler((reason) => {
                me.dispose();
                reject(reason);
            }));

        });
        Logger.debug(me.navigate, "got response from window");
        me.dispose();


        if (!keepOpen) {
            me.close();
        }

        return { url };
    },

    close: Ext.emptyFn,


    destroy() {
        this.destroyMembers('disposeHandlers', 'abort');
        this.callParent();
    },


    privates: {
        dispose() {

            for (let dispose of this.disposeHandlers) {
                dispose();
            }
            this.disposeHandlers.clear();

        }


    }


}, () => {
    window.Oidc = window.Oidc || {};
    Oidc.Window = Common.oidc.window.Abstract;
})