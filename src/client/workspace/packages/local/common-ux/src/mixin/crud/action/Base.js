Ext.define('Common.mixin.crud.action.Base', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    /**
    * 当前操作记录
    */
    currentRecord: null,

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
     * @returns 
     */
    getDefaultDialogConfig() {
        let me = this,
            entityName = me.getEntityName(),
            resourceName = me.getResourceName();
        return {
            xtype: 'uxformdialog',
            entityName: entityName,
            resourceName: resourceName,
            messageField: me.getDefaultMessageField(),
            form: {
                xtype: `${entityName}form`,
                entityName: entityName,
                resourceName: resourceName,
                recordDefaultValue: me.getRecordDefaultValue(),
                record: me.currentRecord
            }
        }
    },

    /**
     * 获取记录默认值，用于新增记录时的默认值
     * @returns 
     */
    getRecordDefaultValue() {
        return {};
    },

    /**
     * 获取多实体远程操作数据
     * @param {Array} records 选中的记录
     * @param {String} messageField 选中记录的提示信息字段
     * @param {String} valueField  选中记录的value字段 
     */
    getRequestData(records, valueField, messageField) {
        let data = [],
            messages = [];
        if (!valueField) Ext.raise('缺少valueField参数');
        //组织数据
        Ext.each(records, (r) => {
            data.push(r.get(valueField));
            messageField && messages.push(r.get(messageField));
        });
        return { data: data, messages: messages };
    },

    /**
     * 显示无选中记录的警告
     */
    showNoSelectionAlert() {
        Alert.error(I18N.get('NoSelection'));
    },

    /**
     * 执行请求
     * @param {Object} options 请求操作配置项
     */
    onRequest(options) {
        let me = this;

        if (!options.isConfirm) {
            //如果没有确认，则直接执行操作
            me.doRequest(options);
            return;
        }
        //确认后执行操作
        Alert.confirm(options.title, me.getConfirmMessage(options))
            .then(
                me.doRequest.bind(me, options),
                options.cancel(options)
            );
    },

    /**
     * 发送请求
     * @param {Object} options 请求操作配置项
     */
    doRequest(options) {
        let me = this,
            client = Http.getClient(options.method);
        if (!client) Ext.raise(`未找到${data.method}方法`);
        if (options.mask !== false) {
            Ext.Viewport.mask(I18N.get(options.mask));
        }
        client.call(Http, options.url, options.data)
            .then(me.onRequestSuccess.bind(me, options),
                me.onRequestFailure.bind(me, options));
    },


    /**
     * 批量操作成功回调
     * @param {XMLHttpRequest} response The XMLHttpRequest object containing the response data. See www.w3.org/TR/XMLHttpRequest/ for details about accessing elements of the response.
     * @param {object} options 删除操作的配置项
     */
    onRequestSuccess(options, response) {
        Ext.Viewport.unmask();
        Alert.success(I18N.get(options.successMessage));
        options.success(response, options);
    },

    /**
     * 批量操作失败回调
     * @param {XMLHttpRequest} response The XMLHttpRequest object containing the response data. See www.w3.org/TR/XMLHttpRequest/ for details about accessing elements of the response.
     * @param {object} options 删除操作的配置项
     */
    onRequestFailure(options, response) {
        Ext.Viewport.unmask();
        Alert.ajax(I18N.get(options.failureMessage), response);
        options.failure(response, options);
    },

    doDestroy() {
        this.destroyMembers('createForm', 'updateForm', 'currentRecord')
    },


    privates: {

        /**
         * 获取默认的提示信息字段
         * @returns 信息字段名称
         */
        getDefaultMessageField() {
            return this.getStore().messageField;
        },

        /**
         * 获取默认url，如果有记录则带上记录id
         * @param {Object} record 需要操作的记录
         * @returns 
         */
        getDefaultUrl(record) {
            let params = [this.getPluralizeEntityName()];
            if (record) {
                params.push(record.getId());
            }
            return URI.get(...params);

        },


        /**
         * 获取批量操作的警告信息
         * @param {Object} options 请求操作配置项
         * @returns 
         */
        getConfirmMessage(options) {
            return Template.getMessage(
                I18N.get(options.confirmMessage),
                options.messages,
                options.itemCls,
                I18N.get(options.warning)
            );
        }
    }


});
