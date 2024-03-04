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
        let config = me.getDialogConfig('create'),
            dialog = Ext.create(config);
        dialog.show();        
    },

    onAfterCreate(){},

    onCancelCreate(){},

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
    onCancelUpdate(){},

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

    getPluralizeEntityName(){
        return Ext.util.Inflector.pluralize(this.getEntityName());
    },

    dialogActonAlias:{
        create: 'add', update: 'edit'
    },

    getDialogConfig(action, title,  formType, callback, cancelCallback, options){
        let me = this,
            actionAlias = me.dialogActonAlias[action],
            entityName = me.getEntityName(),
            resourceName = me.getResourceName();
        action = Ext.String.capitalize(action);
        formType = formType ||  `${entityName}form`.toLowerCase();
        callback = callback || me[`onAfter${action}`].bind(me);
        cancelCallback = cancelCallback || me[`onCancel${action}`].bind(me);
        return Ext.apply({
            langTitle: title || [ actionAlias , entityName],
            xtype: 'uxformdialog',
            action: action,
            actionAlias: actionAlias,
            entityName: entityName,
            resourceName: resourceName,
            form:{
                xtype: formType,
            },
            callback: callback,
            cancelCallback: cancelCallback
        }, options)
    },

    doDestroy() {
        this.destroyMembers('dialogActon');
    }



})
