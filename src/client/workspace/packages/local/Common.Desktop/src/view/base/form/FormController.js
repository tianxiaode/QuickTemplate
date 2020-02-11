Ext.define('Common.Desktop.view.base.form.FormController',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.baseForm',

    init: function(){
        let me = this;
        me.initEnterEvent();
        me.getView().on('hiddenchange', me.initFormState ,me);        
    },

    //query('field[tabIndex]')
    allEnterFields:null,
    //初始化回车键事件
    initEnterEvent(){
        let me = this;
        let view = me.getView();
        if(view.getAutoTabIndex()){
            let fields = me.allEnterFields = view.query('field[focusable]:not([hidden]):not(textfield):not(containerfield):not([disabled]):not([readOnly])');
            let index=0;
            for (const field of fields) {
                field.setTabIndex(index+1);
                field.setKeyMapEnabled(true);
                field.setKeyMap({
                    enter: {
                        handler: me.doEnterNextField,
                        scope: me
                    } 
                });
                index++;                
            }
        }
    },

    //回车键事件，将焦点移动到下一个字段
    doEnterNextField: function (event, field) {
        event.preventDefault();
        let me =  this;
        let [allFields, index]= [ me.allEnterFields, field.getTabIndex()];
        let next = allFields.find((field)=>{
            return field.getTabIndex()>index && !field.getHidden() && !field.getReadOnly();
        });
        if(next)  {
            next.focus();
            return false;
        }
        me.onSave();
        return false;
    },

    //初始化表单状态
    initFormState: function(sender, value, oldValue, eOpts){
         if(!value){
             sender.setHasNewInSaved(false);
             sender.setIsSavedSuccess(false);
        }
    },
    
    //保存并新建
    onSaveAndNew: function(){
        this.afterSavedAction = 'addRecord';
        this.doSave();
    },

    //保存
    onSave: function(){
        this.afterSavedAction = 'onHide';
        this.doSave();
    },

    getEntityName: function(){
        return this.getView().getEntityName();
    },

    beforeFormSave(){ return true},

    //执行提交操作
    doSave: function(){
        let me = this, 
            view = me.getView(),
            values = view.getValues(),
            url = URI.get(view.getSubmitUrl() || me.getEntityName() , view.getIsNew() ? 'create' : 'update');
        if (view.validate() && me.beforeFormSave(view, values)) {
            view.mask(I18N.SaveWaitMsg);
            view.submit({
                jsonData: values,
                method: view.getIsNew() ? 'POST' : 'PUT',
                submitEmptyText: false,
                url: url,
                success: me.onSubmitSuccess,
                failure: me.onSubmitFailure,
                scope: me
            });
        }

    },

    beforeRecordSaved: Ext.emptyFn,
    afterRecordSaved: Ext.emptyFn,

    //提交成功
    onSubmitSuccess: function (view, action, responseText) {
        let [me, record,isNew] =  [this,view.getRecord(), view.getIsNew()];
        view.unmask();
        view.setIsSavedSuccess(true);
        //view.fillRecord(record);
        record.set(action.result);
        record.commit();
        if (isNew) {
            view.setHasNewInSaved(true);
        }
        me.beforeRecordSaved(record, isNew, action);
        let fn = me[me.afterSavedAction] || null;
        Ext.toast(me.getSavedMessage(me.afterSavedAction), view, null, 2000,fn,me);
    },

    //保存失败
    onSubmitFailure: function (sender, action,responseText) {
        sender.unmask();
        FAILED.form(sender, action,responseText);
    },

    //获取提示信息
    getSavedMessage: function (saved) {
        return saved === 'addRecord'
            ? I18N.SavedAndNew
            : saved === 'onHide' ? I18N.SavedAndClose : I18N.SavedAndNothing;
    },

    beforeAddRecord: Ext.emptyFn,
    afterAddRecord: Ext.emptyFn,

    addRecord: function () {
        let me = this;
        let view = me.getView();
        let entityName = view.getEntityName();
        let record= Ext.create(
                'Common.Data.model.' + entityName, 
                Object.assign({}, view.getDefaultModelValue())
            );
        if (Ext.isEmpty(entityName)) Ext.raise('entityName not define');
        me.beforeAddRecord(view,record);
        view.setTitle(I18N.Add + (view.getDefaultTitle() || I18N[entityName]) );
        view.setRecord(record);
        //view.setSubmitUrl(URI.get(entityName, 'create'));
        view.setIsNew(true);
        me.onReset();
        me.afterAddRecord(view,record);
    },

    beforeEditRecord: Ext.emptyFn,
    afterEditRecord: Ext.emptyFn,
    
    editRecord: function (record) {
        let me = this;
        let view = me.getView();
        let entityName = view.getEntityName();
        if (Ext.isEmpty(entityName)) Ext.raise('entityName not define');
        me.beforeEditRecord(view,record);
        view.setRecord(record);
        view.setTitle(I18N.Edit + (view.getDefaultTitle() || I18N[entityName]));
        //view.setSubmitUrl(URI.get(entityName, 'update'));
        view.setIsNew(false);
        me.onReset();
        me.afterEditRecord(view,record);
    },

    //重置
    onReset: function(){
        let me = this;
        let view = me.getView();
        view.reset(true);
        view.initFocus();
    },

    //关闭
    onHide: function(){
        this.getView().onHide();
    }
});