Ext.define('Common.mixin.crud.ButtonAction', {
    extend: 'Ext.Mixin',
    /**
     * 单击新疆按钮
     */
    onCreateButtonTap() {
        let me = this;
        if (me.onBeforeCreate() === false) return;
        Logger.debug(this.onCreateButtonTap, arguments);
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
    },

    /**
     * 单击更新按钮
     * @returns 
     */
    onUpdateButtonTap() {
        let me = this;
        if (me.onBeforeUpdate() === false) return;
        me.doUpdate(selection);
    },

    /**
     * 在执行更新之前的操作，返回false可阻止操作
     * 默认会检测是否有当前记录
     * @param {对话框} dialog 
     * @param {要编辑的记录} selection 
     */
    onBeforeUpdate() { },


    /**
     * 执行更新操作
     */
    doUpdate() {
        //this.onShowView('update', selection,this.getCreateOrUpdateViewEvents());
    },

    /**
    * 单击删除按钮
    */
    onDeleteButtonTap() {
        let me = this;
        if (me.onBeforeDelete() === false) return;
        me.doDelete();
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

    getCreateOrUpdateViewEvents() {
        return {
            saved: this.onCreateOrUpdateViewSaved,
            canceledit: this.onCreateOrUpdateCancelEdit
        }
    },

    /**
     * 新建或更新视图后的操作
     * @param {对话框} dialog 
     * @param {是否保存成功} isSavedSuccess 
     * @param {是否保存了新记录} hasNewInSaved 
     */
    onCreateOrUpdateCancelEdit(sender, hasNew) {
        if (hasNew) {
            this.onRefreshStore();
        }
    },

    /**
     * 新增记录后操作
     * @param {编辑视图}} sender 
     * @param {后续操作} action 
     * @param {新增的记录} record 
     */
    onCreateOrUpdateViewSaved(sender, action, after, record) {
        this.onRefreshStore();
    },



})
