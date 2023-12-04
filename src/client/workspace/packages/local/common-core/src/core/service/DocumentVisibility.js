Ext.define('Common.core.service.DocumentVisibility', {
    singleton: true,

    constructor() {
        let me = this;
        document.addEventListener('visibilitychange', me.onVisibilityChange.bind(me));
    },

    destroy() {
        let me = this;
        document.removeEventListener('visibilitychange', me.onVisibilityChange.bind(me));
        me.callParent();

    },

    privates: {
        onVisibilityChange() {
            Logger.debug(this.onVisibilityChange, document.visibilityState);
            Ext.fireEvent('documentVisibilityChange', document.visibilityState);
            // if (document.visibilityState === 'hidden') {
            // }

            // // 用户打开或回到页面
            // if (document.visibilityState === 'visible') {
            //     Ext.fireEvent('documentVisible');
            // }
        }
    }//end privates

});
