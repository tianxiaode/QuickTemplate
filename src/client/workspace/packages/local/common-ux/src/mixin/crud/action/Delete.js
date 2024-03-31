Ext.define('Common.mixin.crud.action.Delete', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {

        deleteDialog: {
            /**
            * @cfg {Object} title
            * 删除确认对话框的title
            * 如果不设置，则使用默认的标题
            */

            /**
            * @cfg {Object} url
            * 删除确认对话框的提交url
            * 如果不设置，则使用默认的提交url
            */

            /**
            * @cfg {Object} method
            * 删除确认对话框的提交方法，默认值为DELETE，
            * 如果设置为null，则不提交
            */
            method: 'DELETE',

            /**
            * @cfg {Object} success
            * 删除确认对话框的提交成功回调函数
            */

            /**
            * @cfg {Object} cancel
            * 删除确认对话框的取消回调函数
            */

            /**
            * @cfg {Object} failure
            * 删除确认对话框的取消回调函数
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
             * @cfg {String} isBatch
             * 是否批量执行删除操作
             * 默认值为true，使用批量删除
             */
            isBatch: true,

            /**
            * @cfg {Object} mask
            * 提交时遮罩层显示的信息
            * 如果不设置，则使用默认的遮罩层信息
            * 如果设置为false，则不显示遮罩层
            */

            /**
            * @cfg {Object} successMessage
            * 提交成功的提示信息
            * 如果不设置，则使用默认的提示信息
            */

            /**
            * @cfg {Object} failureMessage
            * 提交成功的提示信息
            * 如果不设置，则使用默认的提示信息
            */

        }
    },

    /**
     * 调整删除确认对话框的配置项
     * @param {object} config 
     * @returns 
     */
    applyDeleteDialog(config) {
        let me = this,
            cfg = Ext.apply({
            url: me.getDefaultUrl(),
            success: me.onAfterDelete.bind(me),
            cancel: me.onCancelDelete.bind(me),
            failure: me.onDeleteFailure.bind(me),
            messageField: me.getDefaultMessageField(),
            valueField: 'id',
            confirmMessage: 'DeleteConfirmMessage',
            warning: 'DeleteWarningMessage',
            mask: 'Deleting',
            itemCls: 'danger',
            successMessage: 'DeleteSuccessMessage',
            failureMessage: 'DeleteErrorMessage'
        }, config);
        cfg.title = me.getLocalizedText(config.title ?? 'Delete');
        return cfg;
    },



    /**
    * 单击删除按钮
    */
    onTrashButtonTap(isCurrentRecord) {
        let me = this,
            deletes = isCurrentRecord === true ? [me.currentRecord] : me.getSelections();
        if (me.onBeforeDelete(deletes) === false) return;
        Logger.debug(this.onTrashButtonTap, isCurrentRecord, 'deletes:', deletes);
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
     * 执行删除操作之前的操作，返回false可取消删除操作
     * @param {记录数组} deletes 
     */
    onBeforeDelete(deletes) {
        return this.onDefaultBeforeDelete(deletes);
    },

    /**
    * 删除成功后的回调函数，默认刷新列表
     * @param {响应} response 
     * @param {批量操作配置项} data 
    */
    onAfterDelete(response, data) {
        this.onRefreshStore();
    },

    /**
     * 取消删除的回调函数
     * @param {object} data 
     */
    onCancelDelete(data) {},

    /**
     * 删除失败后的回调函数
     * @param {响应} response 
     * @param {批量操作配置项} data 
     */
    onDeleteFailure(response, data) {},

    /**
     * 执行删除操作
     * @param {数据} data 
     * @returns 
     */
    doDelete(deletes) {
        let me = this,
            config = me.getDeleteDialog(),
            data = me.getBatchData(deletes, config);
        me.doBatch(data);
    },



});
