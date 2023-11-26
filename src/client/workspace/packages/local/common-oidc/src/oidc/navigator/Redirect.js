Ext.define('Common.oidc.navigator.Redirect', {
    extend: 'Common.oidc.navigator.Abstract',
    alias: 'oidc.navigator.redirect',

    async prepare(config){
        let me = this,
            settings = me.settings,
            redirectMethod = config.redirectMethod || settings.redirectMethod,
            redirectTarget = config.redirectTarget || settings.redirectTarget,
            targetWindow = me.getTargetWindow(redirectTarget);

        let redirect = targetWindow.location[redirectMethod].bind(targetWindow.location),
            abort;
        return {
            navigate: async (params) => {
                let promise = new Promise((resolve, reject) => {
                    abort = reject;
                });
                redirect(params.url);
                return await (promise);
            },
            close: () => {
                abort && abort(new Error("Redirect aborted"));
                targetWindow.stop();
            },
        };
    },

    /**
     * 测试用
     * @returns window
     */
    getTargetWindow(redirectTarget){
        return redirectTarget === 'top' ? window.top || window.self : window.self;
    },

    async callback(){
        return;
    }    

})
  