Ext.define('Common.view.settings.BaseFormController',{
    extend: 'Common.ux.form.BaseController',
    alias: 'controller.settingbaseformcontroller',

    mixins:[
        'Common.mixin.AjaxFailure'
    ],

    autoClose: false,
    fireSavedEvent: false,
    savedText: 'UpdateSuccess',

    initParams(view){
        let me = this;
        if(!me.isInitToolbar){
            me.getView().down('#buttonToolbar').setDocked(null);
            me.isInitToolbar = true;
        }
        me.settingName = Format.splitCamelCase(view.settingName);
        me.loadData();
    },

    loadData(){
        let me= this;
        me.getView().mask(I18N.get('LoadingText'));
        Http.get(URI.crud('Setting', me.settingName))
            .then(me.onLoadDataSuccess, me.onAjaxFailure, null, me);
    },

    onLoadDataSuccess(response){
        let view = this.getView();
            data = Http.parseResponse(response);
        view.unmask();
        view.setValues(data);
        view.clearErrors();
    },

    onSave(){
        let me = this,
            view = me.getView();
        if(!me.beforeFormSave(view)) return;
        Http.post(URI.crud('Setting', me.settingName),view.getValues())
            .then(me.onSubmitSuccess, me.onSubmitFailure, null, me);
    },

    lazyClose(){}

})