/**
 * 封装了Ajax和表单提交失败处理的视图控制器
 */
Ext.define('Common.Shared.ux.app.ViewController',{
    extend: 'Ext.app.ViewController',

    onAjaxFailure(response, opts){
        let me = this,
            view = me.getView();
        if(view.unmask) view.unmask();
        if(view.setMasked) view.setMasked(false);
        FAILED.ajax(response,opts, view);
    },
    
    onFormFailure(form, result,data){
        if(form.unmask) form.unmask();
        if(form.setMasked) form.setMasked(false);
        FAILED.form(form, result,data);
    }

})