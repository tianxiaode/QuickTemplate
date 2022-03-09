Ext.define('Common.shared.ux.form.CrudController',{
    extend: 'Common.shared.ux.form.BaseController',
    alias: 'controller.shared-crudformcontroller',

    hasNew: false,
    isNew: false,
    saved: false,

    initParams(view){
        let me = this,
            params = ViewMgr.getParams(view.xtype),
            record = params.record;
        view.setDefaultModelValue(params.defaultModelValue);
        if(record){
            view.setRecord(null);
            view.setRecord(record);
            me.editRecord(record);
            return;
        }
        params.remoteController && view.setRemoteController(params.remoteController);
        me.addRecord();
    },

    /**
     * 保存并新建
     */
     onSaveAndNew(){
        this.afterSavedAction = 'addRecord';
        this.doSave();
    },

    /**
     * 保存
     */
    onSave(){
        this.afterSavedAction = 'onHide';
        this.doSave();
    },

    /**
     * 保存前执行的操作
     */
    beforeFormSave(){ return true},

    /**
     * 执行保存操作
     */
    doSave(){
        let me = this, 
            view = me.getView(),
            values = view.getSubmitValues(),
            entityName = me.entityName,
            remoteController = view.getRemoteController() || URI.crud(entityName, me.isNew ? null :  values.id);                
        if (!(view.validate() && me.beforeFormSave(view, values))) {
            let errors = view.getErrors(),
                msg = Failure.buildValidationErrors(errors, me.resourceName);
                me.showMessage(msg, true);
            return;
        };
        view.mask(I18N.get('Saving'));
        let action = me.isNew ? Http.post : Http.put;                
        action.apply(Http, [remoteController,values]).then(me.onSubmitSuccess, me.onSubmitFailure,null, me);

    },

    /**
     * 记录提交成功后，在更新前的操作
     */
    beforeSaved(){},
    /**
     * 记录提交成功后，在更新后的操作
     */
    afterSaved(){},

    /**
     * 提交成功后的操作
     * @param {响应} response 
     * @param {操作参数} eOpts 
     */
    onSubmitSuccess(response, eOpts) {
        let me = this,
            result = Http.parseResponseText(response),
            view = me.getView(),
            record = view.getRecord();            
        view.unmask();
        me.saved = true;
        if (me.isNew) {
            me.hasNew = true;
        }
        if(record){
            me.beforeSaved(record);
            Ext.Object.each(result.result,(key,value)=>{
                if(Ext.isEmpty(value)) return;
                record.set(key,value);
            });
            //record.set(result.result);
            record.commit();
            me.afterSaved(record);    
        }
        view.fireEvent( 'saved', me, 
            me.isNew ? 'create' : 'update',
            me.afterSavedAction === 'onHide' ? 'hide' : 'add', 
            record , result, response);
        me.showSuccessMessage();
    },


    /**
     * 显示提交成功信息
     */
    showSuccessMessage() {
        let me = this,
            action = me.afterSavedAction;
        let msg = I18N.get(action === 'addRecord' ? 'SavedAndNew' : 'SavedAndClose');
        me.showMessage(msg, false);
        let fn = me[action] || me.onHide;
        if(!fn) return;
        Ext.defer(fn, 2000, me);
    },

    /**
     * 新建记录之前执行的操作
     */
    beforeAddRecord: Ext.emptyFn,

    /**
     * 新建记录之后执行的操作
     */
    afterAddRecord: Ext.emptyFn,

    /**
     * 新建记录
     */
    addRecord() {
        let me = this,
            view = me.getView(),
            resourceName = me.resourceName,
            entityName = me.entityName,
            model = Ext.ClassManager.getByAlias(`entity.${entityName.toLowerCase()}`);
        if (Ext.isEmpty(entityName)) Ext.raise('entityName not define');
        let record= Ext.create(
            model, 
            Object.assign({}, view.getDefaultModelValue())
        );
        me.beforeAddRecord(view,record);
        let title = view.getDefaultTitle() || `${I18N.get(`Add`,resourceName)}${I18N.get(entityName,resourceName)}`;
        view.setTitle(title);
        view.setRecord(record);
        me.isNew = true;
        me.onReset();
        me.afterAddRecord(view,record);
    },

    /**
     * 编辑记录前的操作
     */
    beforeEditRecord: Ext.emptyFn,

    /**
     * 编辑记录后的操作
     */
    afterEditRecord: Ext.emptyFn,
    
    editRecord(record) {
        let me = this,
            view = me.getView(),
            resourceName = me.resourceName,
            entityName = me.entityName;
        if (Ext.isEmpty(entityName)) Ext.raise('entityName not define');
        me.beforeEditRecord(view,record);
        view.setRecord(record);
        let title = view.getDefaultTitle() || `${I18N.get(`Edit`,resourceName)}${I18N.get(entityName,resourceName)}`;
        view.setTitle(title);
        //view.setSubmitUrl(URI.get(entityName, 'update'));
        me.isNew = false;
        me.onReset();
        me.afterEditRecord(view,record);
    },

})