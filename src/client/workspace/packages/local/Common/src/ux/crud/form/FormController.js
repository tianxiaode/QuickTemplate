Ext.define('Common.ux.crud.form.FormController',{
    extend: 'Common.ux.form.BaseController',
    alias: 'controller.uxcrudformcontroller',

    hasNew: false,
    isNew: false,
    saved: false,

    initParams(view){
        let me = this,
            params = ViewMgr.getParams(view.xtype),
            record = params.record;
        me.viewParams = params;
        if(record){
            view.setRecord(null);
            view.setRecord(record);
            me.editRecord(record);
            return;
        }
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
     * 执行保存操作
     */
    doSave(){
        let me = this, 
            view = me.getView(),
            values = view.getSubmitValues(),
            entityName = me.entityName,
            remoteController = view.getRemoteController() || URI.crud(entityName, me.isNew ? null :  values.id);
        if(!me.beforeFormSave()) return;
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
            result = Http.parseResponse(response),
            view = me.getView(),
            record = view.getRecord();            
        view.unmask();
        me.saved = true;
        if (me.isNew) {
            me.hasNew = true;
        }
        if(record){
            me.beforeSaved(record);
            Ext.iterate(result,(key,value)=>{
                if(Ext.isEmpty(value)) return;
                record.set(key,value);
            });
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
        let msg = I18N.get(action === 'addRecord' ? 'SavedAndNew' : 'SavedAndExit');
        me.getView().showMessage(msg, false);
        let fn = me[action] || me.onHide;
        if(!fn) return;
        Ext.defer(fn, 2000, me);
    },

    /**
     * 新建记录之前执行的操作
     */
    beforeAddRecord(){},

    /**
     * 新建记录之后执行的操作
     */
    afterAddRecord(){},

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
            Object.assign({}, me.viewParams.defaultModelValue)
        );
        me.beforeAddRecord(view,record);
        let title = view.getDefaultTitle() || `${I18N.get(`New${entityName}`,resourceName)}`;
        view.setTitle(title);
        view.setRecord(record);
        me.isNew = true;
        me.onReset();
        me.afterAddRecord(view,record);
    },

    /**
     * 编辑记录前的操作
     */
    beforeEditRecord(){},

    /**
     * 编辑记录后的操作
     */
    afterEditRecord(){},
    
    editRecord(record) {
        let me = this,
            view = me.getView(),
            resourceName = me.resourceName,
            entityName = me.entityName;
        if (Ext.isEmpty(entityName)) Ext.raise('entityName not define');
        me.beforeEditRecord(view,record);
        view.setRecord(record);
        let title = view.getDefaultTitle() || `${I18N.get(`Edit${entityName}`,resourceName)}`;
        view.setTitle(title);
        me.isNew = false;
        me.onReset();
        me.afterEditRecord(view,record);
    },

})