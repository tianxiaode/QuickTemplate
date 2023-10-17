
Ext.define('Common.oidc.window.Abstract', {
    requires:[
        'Common.oidc.util.Event'
    ],

    /**
    * Window implementation which resolves via communication from a child window
    * via the `Window.postMessage()` interface.
    *
    * @internal
    */

    messageSource: "oidc-client",

    statics:{
        getLocationOrigin(){
            return window.location.origin
        }
    },

    constructor(config) {
        let me = this;
        Ext.apply(this, config);
        me.disposeHandlers = new Set();
        me.abort = Ext.create('oidc.event');
    },

    async navigate(params) {
        let me = this;
        console.log('super navigate', params, me.window)
        if (!me.window) {
            throw "Attempted to navigate on a disposed window";
        }

        Ext.debug("setting URL in window");
        me.window.location.replace(params.url);
        console.log('location', params.url)

        let { url, keepOpen } = await new Promise((resolve, reject) => {
            let listener = (e) => {
                let data = e.data,
                    origin = params.scriptOrigin ?? Oidc.Window.getLocationOrigin();
                console.log('listener', e, origin)
                if (e.origin !== origin || data?.source !== me.messageSource) {
                    // silently discard events not intended for us
                    return;
                }
                try {
                    let state = URI.readParams(data.url, params.responseMode).get("state");
                    console.log('state',state)
                    if (!state) {
                        Ext.Logger.warn("no state found in response url");
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
        Ext.debug("got response from window");
        me.dispose();

        console.log('cccc', url, keepOpen);

        if (!keepOpen) {
            me.close();
        }

        return { url };
    },
    
    close: Ext.emptyFn,

    notifyParent(parent, url, keepOpen, targetOrigin) {
        parent.postMessage({
            source: this.messageSource,
            url,
            keepOpen,
        }, targetOrigin);
    },

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


}, ()=>{
    window.Oidc = window.Oidc || {};
    Oidc.Window = Common.oidc.window.Abstract;
})