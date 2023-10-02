Ext.define('Common.service.oauth.navigators.AbstractChildWindow',{


    constructor(config){
        let me = this;
        Ext.apply(this, config);
        me.disposeHandlers = new Set();
        me.abort = Ext.create('oauth.event');
    },

    async navigate(params){
        let me = this;
        if (!me.window) {
            Ext.raise("Attempted to navigate on a disposed window");
        }

        Ext.debug("setting URL in window");
        me.window.location.replace(params.url);

        let { url, keepOpen } = await new Promise((resolve, reject) => {
            let listener = (e) => {
                let data = e.data,
                    origin = params.scriptOrigin ?? window.location.origin;
                if (e.origin !== origin || data?.source !== messageSource) {
                    // silently discard events not intended for us
                    return;
                }
                try {
                    let state = URI.readParams(data.url, params.response_mode).get("state");
                    if (!state) {
                        Ext.warn("no state found in response url");
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

        if (!keepOpen) {
            me.close();
        }

        return { url };
    },

    close: Ext.emptyFn,

    notifyParent(parent, url, keepOpen, targetOrigin){
        parent.postMessage({
            source: messageSource,
            url,
            keepOpen,
        }, targetOrigin);
    },

    destroy() {
        this.destroyMembers('disposeHandlers', 'abort');
        this.callParent();
    },


    privates:{
        dispose(){

            for (const dispose of this.disposeHandlers) {
                dispose();
            }
            this.disposeHandlers.clear();
    
        }
    }


})