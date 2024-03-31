Ext.define('Common.mixin.crud.action.Delete', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {

        /**
         * @cfg {Object} deleteOptions
         * 删除操作的配置项
         */
        deleteOptions: {
            /**
            * @cfg {Object} title
            * 删除确认对话框的title
            * 如果不设置，则使用默认的标题
            */

            /**
            * @cfg {Object} url
            * 删除操作的url
            * 如果不设置，则使用默认的提交url
            */

            /**
            * @cfg {Object} method
            * 删除提交方法，默认值为DELETE，
            * 如果设置为null，则不提交
            */
            method: 'DELETE',

            /**
            * @cfg {Object} success
            * 删除成功的回调函数
            */

            /**
            * @cfg {Object} cancel
            * 删除取消的回调函数
            */

            /**
            * @cfg {Object} failure
            * 删除失败的回调函数
            */

            /**
            * @cfg {Object} messageField
            * 用于设置批量操作时获取确认提示信息的字段，
            * 如果不设置，则使用model中isMessage为true的字段
            */

            /**
             * 用于设置批量操作时获取提交参数的字段         * 
             * @cfg {String} valueField 值字段，
             * 如果不设置，则使用model中id为值字段
             */

            /**
             * @cfg {String} confirmMessage
             * 删除确认对话框的提示消息
             * 如果不设置，则使用默认的标题
             */

            /**
             * @cfg {String} warning
             * 删除确认对话框的警告信息
             * 如果不设置，则使用默认的警告信息
             */

            /**
             * @cfg {String} itemCls
             * 删除确认对话框的提示消息的详细信息条目的cls, 默认为'danger'
             */

            /**
             * @cfg {String} isConfirm
             * 是否需要确认
             * 默认值为true，表示需要确认
             */

            /**
            * @cfg {Object} mask
            * 提交时遮罩层显示的信息
            * 如果不设置，则使用默认的遮罩层信息
            * 如果设置为false，则不显示遮罩层
            */

            /**
            * @cfg {Object} successMessage
            * 删除成功的提示信息
            * 如果不设置，则使用默认的提示信息
            */

            /**
            * @cfg {Object} failureMessage
            * 删除失败的提示信息
            * 如果不设置，则使用默认的提示信息
            */

        }
    },

    /**
     * 调整删除确认对话框的配置项
     * @param {object} options 
     * @returns 
     */
    applyDeleteOptions(options) {
        let me = this,
            opts = Ext.apply({
                success: me.onDeleteSuccess.bind(me),
                cancel: me.onCancelDelete.bind(me),
                failure: me.onDeleteFailure.bind(me),
                valueField: 'id',
                confirmMessage: 'DeleteConfirmMessage',
                warning: 'DeleteWarningMessage',
                mask: 'Deleting',
                itemCls: 'danger',
                successMessage: 'DeleteSuccessMessage',
                failureMessage: 'DeleteErrorMessage',
                isConfirm: true,
        }, options);
        opts.title = me.getLocalizedText(options.title ?? 'Delete');
        return opts;
    },



    /**
    * 单击删除按钮
    * @param {Boolean} isCurrentRecord 是否为当前记录
    */
    onTrashButtonTap(isCurrentRecord) {
        let me = this,
            deletes = isCurrentRecord === true ? [me.currentRecord] : me.getSelections();
        if (me.onBeforeDelete(deletes) === false) return;
        me.doDelete(deletes);
    },

    /**
     * 默认的删除之前操作，检测是否有选择的记录
     * 因为重写onBeforeDelete有可能需要重写这部分代码，所以单独抽出来
     * @param {Array} records 要删除的记录数组
     * @returns 
     */
    onDefaultBeforeDelete(records) {
        if (records.length > 0) return true;
        this.showNoSelectionAlert();
        return false;
    },

    /**
     * 执行删除操作之前的操作，返回false可取消删除操作
     * @param {Array} records 要删除的记录数组
     */
    onBeforeDelete(records) {
        return this.onDefaultBeforeDelete(records);
    },

    /**
    * 删除成功后的回调函数，默认刷新列表
     * @param {XMLHttpRequest} response The XMLHttpRequest object containing the response data. See www.w3.org/TR/XMLHttpRequest/ for details about accessing elements of the response.
     * @param {object} options 删除操作的配置项
    */
    onDeleteSuccess(response, options) {
        this.onRefreshStore();
    },

    /**
     * 取消删除的回调函数
     * @param {object} options 删除操作的配置项
     */
    onCancelDelete(options) {},

    /**
     * 删除失败后的回调函数
     * @param {XMLHttpRequest} response The XMLHttpRequest object containing the response data. See www.w3.org/TR/XMLHttpRequest/ for details about accessing elements of the response.
     * @param {object} options 删除操作的配置项
     */
    onDeleteFailure(response, data) {},

    /**
     * 执行删除操作
     * @param {Array} records 要删除的记录数组
     * @returns 
     */
    doDelete(records) {
        let me = this,
            messageField = me.getDefaultMessageField(),
            defaultOptions = me.getDeleteOptions(),
            options = Ext.apply(
                {
                    url: me.getDeleteUrl(),
                    messageField: messageField,        
                }, 
                me.getDeleteData(records, defaultOptions.valueField, messageField), 
                defaultOptions);
        me.onRequest(options);
    },

    /**
     * 获取删除url
     * 添加该方法是方便自定义删除url，譬如格式为/api/entity/{id}这样的url
     * @returns {string}
     */
    getDeleteUrl() {
        return this.getDefaultUrl();
    },

    /**
     * 获取删除操作的提交参数
     * 添加该方法是方便自定义提交参数格式
     * @param {Array} records 要删除的记录数组
     * @param {String} valueField 值字段
     * @param {String} messageField 提示信息字段
     * @returns {Object}
     */
    getDeleteData(records, valueField, messageField) {
        return this.getRequestData(records, valueField, messageField);
    },

    doDestroy(){
        this.destroyMembers('deleteOptions');
    }



});
