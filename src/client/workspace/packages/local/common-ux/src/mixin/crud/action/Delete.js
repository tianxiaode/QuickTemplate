Ext.define('Common.mixin.crud.action.Delete', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {
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


});
