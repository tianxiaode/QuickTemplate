Ext.define('Common.mixin.crud.action.Base', {
    extend: 'Common.mixin.crud.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {
        /**
         * @cfg {String/Object} defaultDialogType
         * 默认对话框类型
         */
        defaultDialogType: 'uxformdialog',
    },

    /**
    * 当前操作记录
    */
    currentRecord: null,


    initialize() {
        let me = this,
            entityName = me.getEntityName(),
            createTitle = me.getCreateDialogTitle(),
            updateTitle = me.getUpdateDialogTitle();
        if (Ext.isEmpty(createTitle)) {
            me.setCreateDialogTitle(me.getLocalizedText(['add', entityName]));
        } else {
            me.setCreateDialogTitle(me.getLocalizedText(createTitle));
        }
        if (Ext.isEmpty(updateTitle)) {
            me.setUpdateDialogTitle(me.getLocalizedText(['edit', entityName]));
        } else {
            me.setUpdateDialogTitle(me.getLocalizedText(updateTitle));
        }

    },

    /**
     * 单击刷新按钮
     */
    onRefreshButtonTap() {

        this.onRefreshStore();
    },

    /**
     * 单击导入按钮
     */
    onImportButtonTap() {
        Logger.debug(this.onImportButtonTap, this);
    },

    /**
     * 单击导出按钮
     */
    onExportButtonTap() {
        Logger.debug(this.onExportButtonTap, this);
    },

    /**
     * 单击搜索按钮
     */
    onSearchButtonTap() {
        this.doSearch();
    },

    onResetButtonTap() {
        this.resetSearchFields();
    },

    resetSearchFields() {
        Logger.debug(this.resetSearchFields, this);
    },

    /**
     * 获取默认对话框配置项
     * @param {操作} action 
     * @param {记录} record 
     * @returns 
     */
    getDefaultDialogConfig(action) {
        let me = this,
            entityName = me.getEntityName(),
            resourceName = me.getResourceName(),
            record = me.currentRecord,
            normalizeAction = me.capitalize(action);
        return {
            xtype: me.getDefaultDialogType(),
            action: action,
            title: action === 'create' ? me.getCreateDialogTitle() : me.getUpdateDialogTitle(),
            createTitle: me.getCreateDialogTitle(),
            createHttpMethod: me.getCreateHttpMethod(),
            createUrl: me.getDialogUrl('create'),
            entityName: entityName,
            resourceName: resourceName,
            callback: me[`onAfter${normalizeAction}`].bind(me),
            cancelCallback: me[`onCancel${normalizeAction}`].bind(me),
            httpMethod: me.getHttpMethod(action),
            form: me.getFormConfig(action, record, entityName, resourceName),
            url: me.getDialogUrl(action, record),
        }
    },

    /**
     * 
     * @returns 获取记录默认值
     */
    getRecordDefaultValue() {
        return {};
    },

    /**
     * 获取多实体远程操作数据
     * @param {要获取数据的记录} records
     * @param {信息字段} messageField 
     * @param {值字段} valueField 
     */
    getBatchData(records, action) {
        let me = this
            messageField = me[`_${action}MessageField`] || me.getDefaultMessageField(),
            valueField = me[`_${action}ValueField`] || me.getDefaultValueField(),
            result = { values: [], messages: [] };
        //组织数据
        Ext.each(records, (r) => {
            let message = r.get(messageField),
                value = r.get(valueField);
            result.values.push(value);
            result.messages.push(message);
        });

        result['url'] = me[`_${action}Url`] || me.getDialogUrl(action);

        result['httpMethod'] = me.getHttpMethod(action);

        result['dialogTitle'] = me[`_${action}DialogTitle`]; 

        result['messageTitle'] = Format.format(I18N.get('ConfirmMessageTitle'), I18N.get(me[`_${action}MessageTitle`]));

        result['messageWarning'] = Format.format(I18N.get('ConfirmMessageWarning'), I18N.get(me[`_${action}MessageWarning`]));

        result['messageType'] = me[`_${action}MessageType`];

        return result;
    },

    showNoSelectionAlert() {
        Alert.error(I18N.get('NoSelection'));
    },



    doDestroy() {
        this.destroyMembers('createForm', 'updateForm', 'currentRecord')
    },


    privates: {

        /**
         * 根据操作和要操作的记录返回表单配置项
         * @param {操作} action 
         * @param {记录} record 
         */
        getFormConfig(action, record, entityName, resourceName) {
            let me = this,
                config = me[`_${action}Form`];
            if (Ext.isEmpty(config)) config = { xtype: `${entityName}form` };
            if (Ext.isString(config)) config = { xtype: config };
            return Ext.apply({
                entityName: entityName,
                resourceName: resourceName,
                isEdit: action === 'update',
                recordDefaultValue: me.getRecordDefaultValue(),
                record: record
            }, config)
        },

        /**
         * 根据操作和记录返回操作url，如果没有自定义，则返回默认值
         * @param {操作} action 
         * @param {记录} record 
         * @returns 
         */
        getDialogUrl(action, record) {
            let me = this,
                url = me[`_${action}Url`];
            return Ext.isEmpty(url)
                ? URI.get(me.getPluralizeEntityName(), action === 'update' ? record.getId() : null)
                : url;
        },

        /**
         * 根据操作返回httpMethod
         * @param {操作} action 
         * @returns 
         */
        getHttpMethod(action) {
            let me = this,
                method = me[`_${action}HttpMethod`];
            return method;
        },

        /**
         * 获取默认的提示信息字段
         * @returns 信息字段名称
         */
        getDefaultMessageField(){
            return this.getStore().messageField;
        },




    }


});
