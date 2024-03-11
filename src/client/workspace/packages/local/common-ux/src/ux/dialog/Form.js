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
        me.successMessage = 'SavedAndNew';
        me.doSave();
    },

    onSave() {
        let me = this;
        me.successMessage = 'SavedAndExit';
        me.doSave();

    },


    validateForm(){
        return this.getForm().validate();
    },

    onBeforeSave(values) { },

    onReset() {
        let me = this,
            form = me.getForm();
        me.getToolbar().getMessageButton().setHidden(true);
        form.reset();
        form.clearErrors();
        form.initFocus();
    },

    updateHidden(hidden, oldHidden){
        this.callParent(arguments);
        !hidden && this.getForm().initFocus();
    },

    doDestroy() {
        this.destroyMembers('httpClient', 'recordDefaultValue');
        this.callParent(arguments);
    },

    privates: {
        /**
         * 执行保存操作
         */
        doSave() {
            let me = this;
            if(!me.validateForm()) return;
        
            let form = me.getForm(),
                url = me.url,
                values = form.getSubmitValues(),
                httpClient = Http.getClient(me.httpMethod);

            if (me.onBeforeSave(values) === false) return;
            if(httpClient){
                me.mask(I18N.get('Saving'));
                httpClient.apply(Http, [url, values]).then(me.onSaveSuccess.bind(me), me.onSaveFailure.bind(me));
            }else{
                me.onSaveSuccess();
            }                        
            
        },

        onSaveSuccess(response) {
            let me = this,
                record = me.getForm().getRecord(),
                data = response && response.request.getJson() || me.getValues();
            me.unmask();
            me.isSaved = true;
            me.showMessage(I18N.get(me.successMessage), false);
            Logger.debug(me.onSaveSuccess, me, response, data);
            if(response){
                record.set(data);
                record.commit();
            }
            if(me.successMessage === 'SavedAndNew'){
                Ext.defer(me.addRecord, 2000, me, data);
            }else{
                Ext.defer(me.close, 2000, me, data);
            }
        },

        onSaveFailure(response) {
            let me = this,
                error = response.request.getError();
            me.unmask();
            me.showMessage(me.getErrorMessage(error), true);
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
                form = me.getForm(),
                record = Ext.create(me.getModelName(), me.recordDefaultValue);
            me.onBeforeAddRecord(record);
            me.setTitle(me.createTitle);
            form.isEdit = false;
            form.setRecord(record);
            me.onReset();
            me.onAfterAddRecord(record);
        },

        showMessage(message, isError){
            this.getToolbar().showMessageButtonTooltip(message,  isError);
        }

    }



})