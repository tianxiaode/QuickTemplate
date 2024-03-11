Ext.define('Common.mixin.crud.ButtonAction', {
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.dialog.Form'
    ],

    mixinConfig:{
        configs: true,
        after: {
            initialize: 'initialize'
        }
    },

    config:{

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
         * @cfg {String} isBatchDelete
         * 是否批量删除，默认值为true，使用批量删除
         */
        isBatchDelete: true,

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
        if(Ext.isEmpty(createTitle)) {
            me.setCreateDialogTitle(me.getLocalizedText(['add', entityName]));
        }else{
            me.setCreateDialogTitle(me.getLocalizedText(createTitle));
        }
        if(Ext.isEmpty(updateTitle)) {
            me.setUpdateDialogTitle(me.getLocalizedText(['edit', entityName]));
        }else{
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
        me.currentRecord =Ext.create(me.getModelName(), me.getRecordDefaultValue());
        let config = me.getDefaultDialogConfig('create');
        let dialog = Ext.create(config);
        dialog.show();
    },

    onAfterCreate(){
        this.onRefreshStore();
    },

    onCancelCreate(){
        Ext.History.back();
    },

    /**
     * 单击更新按钮
     * @returns 
     */
    onUpdateButtonTap() {
        let me = this;
        if (me.onBeforeUpdate() === false) return;
        me.doUpdate();
    },

    /**
     * 在执行更新之前的操作，返回false可阻止操作
     * 默认会检测是否有当前记录
     * @param {对话框} dialog 
     * @param {要编辑的记录} selection 
     */
    onBeforeUpdate() { },

    onAfterUpdate(){
        this.onRefreshStore();
    },
    onCancelUpdate(){
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
    onDeleteButtonTap(isCurrentRecord) {
        let me = this;
        if (me.onBeforeDelete() === false) return;
        me.doDelete(isCurrentRecord);
        // me.doBatch(
        //     I18N.get('DeleteConfirmMessageTitle'),
        //     I18N.get('DeleteConfirmMessage'),
        //     me.deleteAction,
        //     me.getDeleteData
        // );

    },

    /**
     * 执行删除操作之前的操作，返回falsle可取消删除操作
     */
    onBeforeDelete(){},

    /**
     * 执行删除操作
     * @param {数据} data 
     * @returns 
     */
    doDelete(data) {
        return Http.delete(URI.crud(this.entityName), data.ids);
    },

    /**
     * 单击刷新按钮
     */
    onRefreshButtonTap(){
        this.onRefreshStore();
    },

    /**
     * 单击导入按钮
     */
    onImportButtonTap(){
        Logger.debug(this.onImportButtonTap, this);
    },

    /**
     * 单击导出按钮
     */
    onExportButtonTap(){
        Logger.debug(this.onExportButtonTap, this);
    },

    /**
     * 单击搜索按钮
     */
    onSearchButtonTap(){
        this.doSearch();
    },

    onResetButtonTap(){
        this.resetSearchFields();
    },

    resetSearchFields(){
        Logger.debug(this.resetSearchFields, this);
    },

    /**
     * 获取默认对话框配置项
     * @param {操作} action 
     * @param {记录} record 
     * @returns 
     */
    getDefaultDialogConfig(action){
        let me = this,
            entityName = me.getEntityName(),
            record = me.currentRecord,
            normalizeAction = me.capitalize(action);
        return {
            xtype: me.getDefaultDialogType(),
            action: action,
            title: action === 'create' ? me.getCreateDialogTitle() : me.getUpdateDialogTitle(), 
            createTitle: me.getCreateDialogTitle(),
            entityName: entityName,
            resourceName: me.getResourceName(),
            callback: me[`onAfter${normalizeAction}`].bind(me),
            cancelCallback: me[`onCancel${normalizeAction}`].bind(me),
            httpMethod: me.getHttpMethod(action),
            form: me.getFormConfig(action, record),
            url: me.getDialogUrl(action, record),
        }
    },

    /**
     * 
     * @returns 获取记录默认值
     */
    getRecordDefaultValue(){
        return {};
    },


    doDestroy() {
        this.destroyMembers('createForm', 'updateForm', 'currentRecord')
    },


    privates:{

        /**
         * 根据操作和要操作的记录返回表单配置项
         * @param {操作} action 
         * @param {记录} record 
         */
        getFormConfig(action, record){
            let me = this,
                config = me[`_${action}Form`];
            if(Ext.isEmpty(config)) config = { xtype: `${me.getEntityName()}form`};
            if(Ext.isString(config)) config = { xtype: config };
            return Ext.apply({
                isEdit : action === 'update',
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
        getDialogUrl(action, record){
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
        getHttpMethod(action){
            let me = this,
                method = me[`_${action}HttpMethod`];
            return method;
        },
    }



})
