Ext.define('Common.ux.dialog.Form', {
    extend: 'Common.ux.dialog.Base',
    xtype: 'uxformdialog',

    mixins: [
        'Common.mixin.Form',
        'Common.mixin.Normalize'
    ],

    weighted: true,

    config: {
        toolbar: {
            xtype: 'uxdialogtoolbar',
            docked: 'bottom',
            messageButton: { weight: 100, hidden: true },
            resetButton: { weight: 200 },
            saveAndNewButton: { weight: 300 },
            saveButton: { weight: 400 },
        },
        form: { weight: 100, },
    },

    getValues() {
        return this.getForm().getSubmitValues();
    },

    onSaveAndNew() {
        let me = this;
        if(!me.validateForm()) return;
        me.afterSavedAction = me.addRecord.bind(me);
        me.onSave();
    },

    onSave() {
        let me = this;
        if(!me.validateForm()) return;
            
        let values = me.getValues();
        if (me.onBeforeSave(values) === false) return;
        me.doSave(values);

    },


    validateForm(){
        return this.getForm().validate();
    },

    onBeforeSave(values) { },

    onReset() {
        let form = this.getForm();
        form.reset();
        form.clearErrors();
        form.initFocus();
    },

    updateHidden(hidden, oldHidden){
        Logger.debug(this.updateHidden, this)
        this.callParent(arguments);
        !hidden && this.getForm().initFocus();
    },

    doDestroy() {
        this.destroyMembers('httpClient', 'recordDefaultValue', 'afterSavedAction');
        this.callParent(arguments);
    },

    privates: {
        /**
         * 执行保存操作
         */
        doSave() {
            let me = this,
                form = me.getForm(),
                url = me.url,
                values = form.getSubmitValues(),
                httpClient = Http[me.httpMethod];
            if (me.onBeforeSave(values) === false) return;
            if(httpClient){
                me.mask(I18N.get('Saving'));
                httpClient.apply(Http, [url, values]).then(me.onSaveSuccess.bind(me), me.onSaveFailure.bind(me));
            }else{
                me.isSaved = true;                
                me.close(values);
            }                        
            
        },

        onSaveSuccess() {

        },

        onSaveFailure(response) {
            let me = this,
                error = response.request.getError();
            me.unmask();
            Logger.debug(this.onSaveFailure, error)
            me.getToolbar().showMessageButtonTooltip(me.getErrorMessage(error),  true);
            if(error.validationErrors){
                me.getForm().setErrors(error.validationErrors);
            }
        },

        /**
         * 新建记录之前执行的操作
         */
        onBeforeAddRecord() { },

        /**
         * 新建记录之后执行的操作
         */
        onAfterAddRecord() { },

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
            let record = Ext.create(
                model,
                Object.assign({}, me.viewParams.defaultModelValue)
            );
            me.beforeAddRecord(view, record);
            let title = view.getDefaultTitle() || `${I18N.get(`New${entityName}`, resourceName)}`;
            view.setTitle(title);
            view.setRecord(record);
            me.isNew = true;
            me.onReset();
            me.afterAddRecord(view, record);
        },

    }



})