Ext.define('Common.oidc.navigator.Redirect', {
    extend: 'Common.oidc.navigator.Abstract',
    alias: 'oidc.navigator.redirect',

    async prepare(config){
        let me = this,
            redirectMethod = config.redirectMethod ?? me.redirectMethod ,
            redirectTarget = config.redirectTarget ?? me.redirectTarget,
            targetWindow = me.getTargetWindow();

        if (redirectTarget === "top") {
            targetWindow = me.getTargetWindow(true);
        }
    
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
                abort?.(new Error("Redirect aborted"));
                targetWindow.stop();
            },
        };
    },

    /**
     * 测试用
     * @returns window
     */
    getTargetWindow(isTop){
        return isTop ? window.top ?? window.self : window.self;
    },

    async callback(){
        return;
    }    

})
  