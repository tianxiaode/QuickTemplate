Ext.define('Common.mixin.crud.action.Update', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {
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


});
