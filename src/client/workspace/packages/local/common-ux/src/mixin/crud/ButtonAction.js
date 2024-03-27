Ext.define('Common.mixin.crud.ButtonAction', {
    extend: 'Ext.Mixin',

    requires: [
        'Common.ux.dialog.Form'
    ],

    mixinConfig: {
        configs: true,
        after: {
            initialize: 'initialize'
        }
    },

    config: {

        /**
         * @cfg {String/Object} defaultDialogType
         * 默认对话框类型
         */
        defaultDialogType: 'uxformdialog',

        /**
         * @cfg {String/Object} createForm
         * 表单xtype或表单定义，默认值为实体名称加"form",如：userform
         */
        createForm: null,

        /**
         * @cfg {String} createUrl
         * 新增记录的提交url，默认值为：http://域名/实体名复数
         */
        createUrl: null,

        /**
         * @cfg {String} createHttpMethod
         * 新增记录的提交方式
         */
        createHttpMethod: 'POST',

        /**
         * @cfg {String} createDialogTitle
         * 新增记录对话框的标题
         */
        createDialogTitle: null,

        /**
         * @cfg {String/Object} updateForm
         * 表单xtype或表单定义，默认值为实体名称加"form",如：userform
         */
        updateForm: null,

        /**
         * @cfg {String} updateUrl
         * 更新记录的提交url，默认值为：http://域名/实体名复数/{id}
         */
        updateUrl: null,

        /**
         * @cfg {String} updateHttpMethod
         * 更新记录的提交方式
         */
        updateHttpMethod: 'PUT',

        /**
         * @cfg {String} updateDialogTitle
         * 更新记录对话框的标题
         */
        updateDialogTitle: null,

        /**
         * @cfg {String} deleteUrl
         * 删除记录的提交url，默认值为：http://域名/实体名复数
         */
        deleteUrl: null,

        /**
         * @cfg {String} deleteHttpMethod
         * 删除记录的提交方式
         */
        deleteHttpMethod: 'DELETE',

        /**
         * 用于设置批量操作时获取确认提示信息的字段
         * @cfg {String} messageField 信息字段
         */
        deleteMessageField: null,

        /**
         * 用于设置批量操作时获取提交参数的字段         * 
         * @cfg {String} valueField 值字段
         */
        deleteValueField: null,

        /**
         * @cfg {String} deleteConfirmTitle
         * 删除确认对话框的标题, 默认值为'Delete'
         */
        deleteDialogTitle: 'Delete',

        /**
         * @cfg {String} deleteConfirmMessageTitle
         * 删除确认对话框的提示消息标题, 默认值为'Delete'
         */
        deleteMessageTitle: 'Delete',

        /**
         * @cfg {String} deleteConfirmMessageWarning
         * 删除确认对话框的提示消息警告,默认值为'Delete'
         */
        deleteMessageWarning: 'Delete',

        /**
         * @cfg {String} deleteConfirmMessageType
         * 删除确认对话框的提示消息类型, 默认为'danger'
         */
        deleteMessageType: 'danger',

        /**
         * @cfg {String} defaultValueField
         * 批量操作的默认值字段
         */
        defaultValueField: 'id'
    },

    /**
     * @cfg {String} isBatchDelete
     * 是否批量删除，默认值为true，使用批量删除
     */
    isBatchDelete: true,

    /**
     * 当前操作记录
     */
    currentRecord: null,



    // applyDeleteConfirmTitle(value, oldValue) {
    //     return I18N.get(value);
    // },

    // applyDeleteConfirmMessageTitle(value, oldValue) {
    //     return Format.format(I18N.get('ConfirmMessageTitle'), I18N.get(value));
    // },

    // applyDeleteConfirmMessageWarning(value, oldValue) {
    //     return Format.format(I18N.get('ConfirmMessageWarning'), I18N.get(value));
    // },


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
     * 单击新疆按钮
     */
    onCreateButtonTap() {
        let me = this;
        if (me.onBeforeCreate() === false) return;
        me.doCreate();
    },

    /**
     * 在执行新建之前的操作，返回false可阻止对话框显示
     * @param {对话框} dialog 
     */
    onBeforeCreate() { },

    /**
     * 执行创建操作，可重写
     */
    doCreate() {
        let me = this;
        Ext.History.add(`${me.getPluralizeEntityName()}/add`);
        me.currentRecord = Ext.create(me.getModelName(), me.getRecordDefaultValue());
        let config = me.getDefaultDialogConfig('create');
        let dialog = Ext.create(config);
        dialog.show();
    },

    onAfterCreate() {
        this.onRefreshStore();
    },

    onCancelCreate() {
        Ext.History.back();
    },

    /**
     * 单击更新按钮
     * @returns 
     */
    onUpdateButtonTap() {
        let me = this;
        if (me.onBeforeUpdate(me.currentRecord) === false) return;
        me.doUpdate();
    },

    /**
     * 默认的更新之前操作，检测是否有当前记录
     * 因为重写onBeforeUpdate有可能需要重写这部分代码，所以单独抽出来
     * @param {记录} record 
     * @returns 
     */
    onDefaultBeforeUpdate(record) {
        if (record) return true;
        this.showNoSelectionAlert();
        return false;
    },

    /**
     * 在执行更新之前的操作，返回false可阻止操作
     * 默认会检测是否有当前记录
     * @param {对话框} dialog 
     * @param {要编辑的记录} selection 
     */
    onBeforeUpdate(record) { 
        return this.onDefaultBeforeUpdate(record);
    },

    onAfterUpdate() {
        this.onRefreshStore();
    },
    onCancelUpdate() {
        Ext.History.back();
        this.currentRecord = null;
    },

    /**
     * 执行更新操作
     */
    doUpdate() {
        let me = this,
            id = me.currentRecord.getId();
        Ext.History.add(`${me.getPluralizeEntityName()}/${id}`);
        let config = me.getDefaultDialogConfig('update');

        let dialog = Ext.create(config);
        dialog.show();
    },

    /**
    * 单击删除按钮
    */
    onTrashButtonTap(isCurrentRecord) {
        let me = this,
            deletes = isCurrentRecord ? [me.currentRecord] : me.getSelections();
        if (me.onBeforeDelete([]) === false) return;
        me.doDelete(deletes);
    },

    /**
     * 默认的删除之前操作，检测是否有选择的记录
     * 因为重写onBeforeDelete有可能需要重写这部分代码，所以单独抽出来
     * @param {记录} records 
     * @returns 
     */
    onDefaultBeforeDelete(deletes) {
        if (deletes.length > 0) return true;
        this.showNoSelectionAlert();
        return false; 
    },

    /**
     * 执行删除操作之前的操作，返回falsle可取消删除操作
     */
    onBeforeDelete(deletes) { 
        return this.onDefaultBeforeDelete(deletes);
    },

    /**
     * 执行删除操作
     * @param {数据} data 
     * @returns 
     */
    doDelete(deletes) {
        let me = this,
            data = me.getBatchData(deletes, 'delete');
        Logger.debug(this.doDelete, data);
        return;
        me.doBatch(records, 'delete', me.isBatchDelete);
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



})
