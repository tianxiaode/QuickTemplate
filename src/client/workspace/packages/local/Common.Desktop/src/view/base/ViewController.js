Ext.define('Common.Desktop.view.base.ViewController',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.baseviewcontroller',

    onAjaxFailure(response, opts){
        let me = this,
            view = me.getView();
        if(view.unmask) view.unmask();
        FAILED.ajax(response,opts, view);
    },


    onFormFailure: function (sender, action,responseText) {
        sender.unmask();
        FAILED.form(sender, action,responseText);
    },

});