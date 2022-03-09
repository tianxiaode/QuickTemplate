Ext.define('Common.shared.view.authentication.LockingWindow',{
    extend: 'Common.shared.view.BasePage',
    xtype: 'shared-lockingwindow',

    bodyCls: 'bg-lock-screen',

    errorCls: 'text-danger text-center lh-30',
    successCls: 'text-success text-center lh-30',

    showMessage(html, cls){
        let me = this,
            errorCmp = me.getErrorCmp();
        if(!errorCmp) return;
        me.setMasked(false);
        errorCmp.setHtml(html);
        errorCmp.setUserCls(cls);
        errorCmp.setHidden(false);
    },

    getErrorCmp(){
        return this.down('#errorCmp');
    }

})