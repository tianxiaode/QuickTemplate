
Ext.define('Common.oidc.window.IFrame', {
    extend: 'Common.oidc.window.Abstract',
    alias: 'oidc.window.iframe',

    timeoutInSeconds: 10,

    statics:{
        notifyParent(url, targetOrigin){
            return Oidc.Window.notifyParent(window.parent, url, false, targetOrigin);
        }    
    },

    constructor(config){
        let me = this;
        me.callParent(arguments);
        if(config && config.silentRequestTimeoutInSeconds) {
            me.timeoutInSeconds = config.silentRequestTimeoutInSeconds;
        }
        me.frame = me.createHiddenIframe();
        me.window = me.frame.contentWindow;
       
    },

    async navigate(params) {
        let me = this;
        Logger.debug("navigate: Using timeout of:" + me.timeoutInSeconds);
        let timer = setTimeout(() => me.abort.raise("IFrame timed out without a response"), me.timeoutInSeconds * 1000);
        me.disposeHandlers.add(() => clearTimeout(timer));

        return await me.callParent(arguments);
    },

    close() {
        let me = this;
        if (me.frame) {
            if (me.frame.parentNode) {
                me.frame.addEventListener("load", (ev) => {
                    let frame = ev.target;
                    frame.parentNode?.removeChild(frame);
                    me.abort.raise("IFrame removed from DOM");
                }, true);
                me.frame.contentWindow?.location.replace("about:blank");
            }
            me.frame = null;
        }
        me.window = null;
    },


    destroy() {
        this.destroyMembers('frame', 'window');
        this.callParent();
    },

    privates:{
        createHiddenIframe() {
            let iframe = window.document.createElement("iframe");
    
            // shotgun approach
            iframe.style.visibility = "hidden";
            iframe.style.position = "fixed";
            iframe.style.left = "-1000px";
            iframe.style.top = "0";
            iframe.width = "0";
            iframe.height = "0";
    
            window.document.body.appendChild(iframe);
            return iframe;
        }    
    }
})
