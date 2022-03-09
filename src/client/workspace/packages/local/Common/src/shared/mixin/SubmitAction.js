Ext.define('Common.shared.mixin.SubmitAction', {
    extend: 'Ext.Mixin',

    getButton(xtype){
        let me = this,
            view = me.isController ? me.getView() : me;
        return view.down(xtype);
    },

    /**
     * 关闭
     */
    onHide(){
        let me = this,
            view = me.getView();
        if(!view.isGlobalView){
            view.hide();
            return;
        }
        let entityName = me.entityName || (me.getEntityName && me.getEntityName());
        me.redirectTo(me.backView || `${entityName.toLowerCase()}view`);
    },

    onErrorOrSuccessTap(sender){
        if(Ext.platformTags.phone) sender.getTooltip().show();
    },
 
     /**
      * 提交失败后的操作
      * @param {响应} response 
      * @param {操作} eOpts 
      */
     onSubmitFailure(response, eOpts) {
         let me = this,
             view = me.getView(),
             tooltip = me.errorButton.getTooltip(),
             error = Failure.ajax(response, me.resourceName, false);
         view.unmask();
         me.errorButton.setHidden(false);
         me.successButton.setHidden(true);
         if(!Ext.isString(error)){
             view.setErrors(error);
             let msg = me.buildErrors(error, me.resourceName);
             tooltip.setHtml(msg);
             tooltip.show();
             return;
         }
         tooltip.setHtml(error);
         tooltip.show();
     },
 
     buildErrors(errors,resourceName){
         let view = this.getView(),
             msg = '<ul class="message-tips">';
         for(let e in errors){
             let error = errors[e];
             if(!Ext.isArray(error)) continue;
             let field = view.down(`field[name=${e}]`);
             if(!field) return;
             msg += `<li class="danger lh-20"><b>${field.getLabel()}</b>： ${error.join('<br>')}</li>`;
         }
         msg += '</ul>'
         return msg;
     },
 
     onSubmitSuccess(response){
         let me = this;
         me.getView().unmask();
         me.showSuccessMessage(I18N.get('SavedAndClose'));
         if(me.fireSavedEvent) me.getView().fireEvent('saved');
         me.lazyClose();
     },
     
     
     /**
      * 显示提交成功信息
      */
      showSuccessMessage(msg) {
         let me = this;
         me.successButton.setHidden(false);
         me.errorButton.setHidden(true);
         let tooltip = me.successButton.getTooltip();
         tooltip.setHtml(`<p class="m-0 p-0">${msg}</p>`);
         tooltip.show();
     },
 
     showErrorMessage(msg) {
         let me = this;
         me.successButton.setHidden(true);
         me.errorButton.setHidden(false);
         let tooltip = me.errorButton.getTooltip();
         tooltip.setHtml(`<p class="m-0 p-0">${msg}</p>`);
         tooltip.show();
     },
 
 
     lazyClose(fn){
         Ext.defer(this.onHide, 2000, this);
     },
 
     onOk: Ext.emptyFn
        
})
