Ext.define('Common.mixin.crud.ButtonAction', {
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.dialog.Form'
    ],

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
        let me = this;
        Ext.History.add(`${me.getPluralizeEntityName()}/add`);
        let config = me.getDefaultDialogConfig('create', Ext.create(me.getModelName(), me.getRecordDefaultValue())),
            dialog = Ext.create(config);
        dialog.show();        
    },

    onAfterCreate(){},

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
        me.doUpdate(selection);
    },

    /**
     * 在执行更新之前的操作，返回false可阻止操作
     * 默认会检测是否有当前记录
     * @param {对话框} dialog 
     * @param {要编辑的记录} selection 
     */
    onBeforeUpdate() { },

    onAfterUpdate(){},
    onCancelUpdate(){
        Ext.History.back();
    },

    /**
     * 执行更新操作
     */
    doUpdate() {
        let me = this,
            entityName = me.getEntityName(),
            id;
        Ext.History.add(`${me.getPluralizeEntityName()}/${id}`);
        ViewService.showDialog('edit', `${entityName.toLocaleLowerCase()}edit`, me.onAfterUpdate.bind(me), me.onCancelUpdate.bind(me));
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

    /**
     * 根据操作返回httpClient
     * @param {操作} action 
     * @returns 
     */
    getHttpClient(action){
        action = action.toLocaleLowerCase();
        return action === 'create' ? Http.post
            : action === 'update' ? Http.put
            : action;
    },


    /**
     * 获取默认对话框配置项
     * @param {操作} action 
     * @param {记录} record 
     * @returns 
     */
    getDefaultDialogConfig(action, record){
        let me = this,
            entityName = me.getEntityName(),
            normalizeAction =  me.capitalize(action);
        return {
            xtype: 'uxformdialog',
            action: action,
            langTitle: me.getDefaultDialogTitle(action),
            entityName: entityName,
            resourceName: me.getResourceName(),
            callback: me[`onAfter${normalizeAction}`].bind(me),
            cancelCallback: me[`onCancel${normalizeAction}`].bind(me),
            httpClient: me.getHttpClient(action),
            form:{
                xtype: me.getFormType(),
                recordDefaultValue: me.getRecordDefaultValue(),
                record: record
            },
            url: URI.get(me.getPluralizeEntityName(), action === 'update' ? record.getId() : null),
        }
    },

    /**
     * 根据操作获取默认标题
     * @param {操作} action 
     * @returns 
     */

    getDefaultDialogTitle(action){
        let entityName = this.getEntityName();
        return action === 'create' ? ['add', entityName] : ['edit', entityName];
    },

    /**
     * 
     * @returns 获取记录默认值
     */
    getRecordDefaultValue(){
        return {};
    },

    doDestroy() {
    }



})
