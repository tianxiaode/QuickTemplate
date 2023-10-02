Ext.define('Common.oidc.navigator.Redirect', {
    extend: 'Common.oidc.navigator.Abstract',
    alias: 'oidc.navigator.redirect',

    async prepare(){
        let me = this,
            settings = me.settings,
            redirectMethod = settings.redirectMethod,
            redirectTarget = settings.redirectTarget,
            targetWindow = window.self;

        if (redirectTarget === "top") {
            targetWindow = window.top ?? window.self;
        }
    
        let redirect = targetWindow.location[redirectMethod].bind(targetWindow.location),
            abort = (reason) => {};
        return {
            navigate: async (params) => {
                let promise = new Promise((resolve, reject) => {
                    abort = reject;
                });
                redirect(params.url);
                return await (promise);
            },
            close: () => {
                abort?.("Redirect aborted");
                targetWindow.stop();
            },
        };
    },

    async callback(){
        return;
    }    

})
  