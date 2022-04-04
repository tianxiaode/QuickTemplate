Ext.define('Common.ux.crud.controller.mixin.Crud',{
    extend: 'Ext.Mixin',

    /**
     * 在执行新建之前的操作，返回false可阻止对话框显示
     * @param {对话框} dialog 
     */
    beforeCreate(){return true;},

    onCreate(){
        let me = this;
        if(!me.beforeCreate()) return;
        me.onShowView('create', null, me.getCreateOrUpdateViewEvents());
    },

    onUpdate(){
        let me = this,
            selection = me.getSelections()[0];
        
        if(!me.beforeUpdate(selection)) return;

        me.doUpdate(selection);
    },

    /**
     * 在执行更新之前的操作，返回false可阻止对话框显示
     * 默认会检测是否有当前记录
     * @param {对话框} dialog 
     * @param {要编辑的记录} selection 
     */
    beforeUpdate(selection){
        if(selection) return true;
        let entityName = this.entityName;
        MsgBox.alert(null, Format.format(
            I18N.get('NoSelection'), 
            I18N.get(entityName, me.resourceName), 
            I18N.get('Edit')));
        return false;
    },


    doUpdate(selection){
        this.onShowView('update', selection,this.getCreateOrUpdateViewEvents());
    },

    getCreateOrUpdateViewEvents(){
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
    onCreateOrUpdateCancelEdit(sender, hasNew){
        if(hasNew){
            this.onRefreshStore();
        }
    },

    /**
     * 新增记录后操作
     * @param {编辑视图}} sender 
     * @param {后续操作} action 
     * @param {新增的记录} record 
     */
    onCreateOrUpdateViewSaved(sender, action, after , record){
        this.onRefreshStore();
    },


        /**
     * 删除实体
     */
    onDelete(){
        let me = this;
        me.doBatch(
            I18N.get('DeleteConfirmMessageTitle'),
            I18N.get('DeleteConfirmMessage'),
            me.deleteAction,
            me.getDeleteData
        );

    },

    deleteAction(data){
        return Http.delete(URI.crud(this.entityName), data.ids);
    },


})
