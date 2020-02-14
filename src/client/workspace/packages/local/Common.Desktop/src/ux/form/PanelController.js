Ext.define('Common.Desktop.view.base.form.FormController',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.uxform',

    init(){
        let me = this;
        me.initEnterEvent();
        me.getView().on('hiddenchange', me.initFormState ,me);        
    },

    /**
     * 所有需要定义回车事件的字段
     */
    allEnterFields:null,

    /**
     * 初始化回车事件
     */
    initEnterEvent(){
        let me = this,
            view = me.getView();
        if(!view.getAutoTabIndex()) return;
        let fields = me.allEnterFields = view.query('field[focusable]:not([hidden]):not(textfield):not(containerfield):not([disabled]):not([readOnly])');
        fields.forEach((field,index)=>{
            field.setTabIndex(index+1);
            field.setKeyMapEnabled(true);
            field.setKeyMap({
                enter: {
                    handler: me.doEnterNextField,
                    scope: me
                } 
            });
        });
    },

    /**
     * 将焦点移动到下一个字段
     * @param {事件} event 
     * @param {字段} field 
     */
    doEnterNextField(event, field) {
        event.preventDefault();
        let me =  this,
            allFields=me.allEnterFields,
            index = field.getTabIndex();
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

    /**
     * 初始化表单状态
     * @param {表单}} sender 
     * @param {值} value 
     * @param {旧值} oldValue 
     * @param {事件} eOpts 
     */
    initFormState(sender, value, oldValue, eOpts){
         if(!value){
             sender.setHasNewInSaved(false);
             sender.setIsSavedSuccess(false);
        }
    },
    
    /**
     * 保存并新建
     */
    //保存并新建
    onSaveAndNew(){
        let me = this;
        me.afterSavedAction = 'addRecord';
        me.doSave();
    },

    /**
     * 保存
     */
    onSave(){
        let me = this;
        me.afterSavedAction = 'onHide';
        me.doSave();
    },

    /**
     * 获取实体名称
     */
    getEntityName(){
        return this.getView().getEntityName();
    },

    beforeFormSave(){ return true},

    /**
     * 执行保存操作
     */
    doSave(){
        let me = this, 
            view = me.getView(),
            values = view.getValues({ serialize: true }),
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

    /**
     * 保存成功
     * @param {表单} view 
     * @param {操作} action 
     * @param {相应信息} responseText 
     */
    onSubmitSuccess(view, action, responseText) {
        let me = this,
            record = view.getRecord(),
            isNew = view.getIsNew();
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

    /**
     * 保存失败
     * @param {表单}} sender 
     * @param {操作} action 
     * @param {响应信息} responseText 
     */
    onSubmitFailure(sender, action,responseText) {
        sender.unmask();
        FAILED.form(sender, action,responseText);
    },

    /**
     * 获取提示信息
     * @param {} saved 
     */
    getSavedMessage(saved) {
        return saved === 'addRecord'
            ? I18N.SavedAndNew
            : saved === 'onHide' ? I18N.SavedAndClose : I18N.SavedAndNothing;
    },

    beforeAddRecord: Ext.emptyFn,
    afterAddRecord: Ext.emptyFn,

    /**
     * 添加记录
     */
    addRecord() {
        let me = this,
            view = me.getView(),
            entityName = view.getEntityName(),
            record= Ext.create(
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
    
    /**
     * 编辑记录
     * @param {记录} record 
     */
    editRecord: function (record) {
        let me = this,
            view = me.getView(),
            entityName = view.getEntityName();
        if (Ext.isEmpty(entityName)) Ext.raise('entityName not define');
        me.beforeEditRecord(view,record);
        view.setRecord(record);
        view.setTitle(I18N.Edit + (view.getDefaultTitle() || I18N[entityName]));
        //view.setSubmitUrl(URI.get(entityName, 'update'));
        view.setIsNew(false);
        me.onReset();
        me.afterEditRecord(view,record);
    },

    /**
     * 重置
     */
    onReset: function(){
        let me = this,
            view = me.getView();
        view.reset(true);
        view.initFocus();
    },

    /**
     * 关闭
     */
    onHide: function(){
        this.getView().onHide();
    }
});