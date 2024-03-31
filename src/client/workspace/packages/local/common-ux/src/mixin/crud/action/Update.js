Ext.define('Common.mixin.crud.action.Update', {
    extend: 'Common.mixin.Base',

    requires: [
        'Common.ux.dialog.Form'
    ],

    config: {

        /**
         * @cfg {Object} updateDialog
         * 更新对话框的配置项，可重写
         */
        updateDialog: {
            /**
            * @cfg {Object} xtype
            * 更新对话框的xtype
            */

            /**
            * @cfg {Object} title
            * 更新对话框的title
            */

            /**
            * @cfg {Object/String} form
            * 更新对话框的form的配置对象或xtype
            */

            /**
            * @cfg {Object} url
            * 更新对话框的提交url
            * 如果不设置，则使用默认的提交url
            */

            /**
            * @cfg {Object} method
            * 更新对话框的提交方法，默认值为PUT，
            * 如果设置为null，则不提交
            */
            method: 'PUT',

            /**
            * @cfg {Object} callback
            * 更新对话框的提交成功回调函数
            */

            /**
            * @cfg {Object} cancelCallback
            * 更新对话框的取消回调函数
            */
        },


    },

    /**
     * 调整更新对话框的配置项
     * @param {object} config 
     * @returns 
     */
    applyUpdateDialog(config) {
        let me = this;
        config = Ext.clone(config);
        if (Ext.isString(config.form)) {
            config.form = { xtype: config.form };
        }
        if (!config.callback) {
            config.callback = me.onAfterUpdate.bind(me);
        }

        if (!config.cancelCallback) {
            config.cancelCallback = me.onCancelUpdate.bind(me);
        }
        return config;
    },

    /**
     * 获取更新对话框配置项
     * @returns {Object} 创建对话框的配置项
     */
    getUpdateDialogConfig() {
        let me = this,
            defaultConfig = me.getDefaultDialogConfig(),
            custom = me.getUpdateDialog(),
            form = Ext.apply(defaultConfig.form, custom.form),
            config;
        form.isEdit = true;
        config = Ext.apply({
            xtype: 'uxformdialog',
            action: 'update',
            url: me.getDefaultUrl(me.currentRecord),
            createConfig: me.getCreateConfig(),
        }, custom, defaultConfig);
        config.form = form;
        return config;
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

    /**
     * 更新成功后的操作
     */

    onAfterUpdate() {
        this.onRefreshStore();
    },

    /**
     * 取消更新操作
     */
    onCancelUpdate() {
        Ext.History.back();
    },

    /**
     * 执行更新操作
     */
    doUpdate() {
        let me = this,
            id = me.currentRecord.getId();
        Ext.History.add(`${me.getPluralizeEntityName()}/${id}`);
        let config = me.getUpdateDialogConfig();

        let dialog = Ext.create(config);
        dialog.show();
    },

    doDestroy(){
        this.destroyMembers('updateDialog');
    }


});
