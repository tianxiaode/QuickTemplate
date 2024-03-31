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
    getBatchData(records, config) {
        let messageField = config.messageField,
            valueField = config.valueField,
            data = Ext.apply({ values: [], messages: [] }, config);
        //组织数据
        Ext.each(records, (r) => {
            let message = r.get(messageField),
                value = r.get(valueField);
            data.values.push(value);
            data.messages.push(message);
        });
        return data;
    },

    showNoSelectionAlert() {
        Alert.error(I18N.get('NoSelection'));
    },

    doBatch(data) {
        let me = this;

        //确认后执行操作
        Alert.confirm(data.title, me.getConfirmMessage(data))
            .then(
                () => {
                    let client = Http.getClient(data.method);
                    if (!client) Ext.raise(`未找到${data.method}方法`);
                    if (data.mask !== false) {
                        Ext.Viewport.mask(I18N.get(data.mask));
                    }
                    client.call(Http, data.url, data.values)
                        .then(me.onBatchSuccess.bind(me, data),
                            me.onBatchFailure.bind(me, data));
                },
                data.cancel(data)
            );
    },


    /**
     * 批量操作成功回调
     * @param {作用域} sender 
     * @param {响应} response 
     * @param {批量操作配置项} data 
     */
    onBatchSuccess(data, response) {
        Ext.Viewport.unmask();
        Alert.success(I18N.get(data.successMessage));
        data.success(response, data);
    },

    /**
     * 批量操作失败回调
     * @param {作用域} sender 
     * @param {响应} response 
     * @param {批量操作配置项} data 
     */
    onBatchFailure(data,response) {
        Ext.Viewport.unmask();
        Alert.ajax(I18N.get(data.failureMessage), response);
        data.failure(response, data);
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
         * @param {记录} record 
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
         * @param {批量操作配置项} config 
         * @returns 
         */
        getConfirmMessage(data) {
            return Template.getMessage(
                I18N.get(data.confirmMessage),
                data.messages,
                data.itemCls,
                I18N.get(data.warning)
            );
        }
    }


});
