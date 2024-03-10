Ext.define('Common.mixin.grid.CheckChange', {
    extend: 'Common.mixin.Component',

    config: {
        checkChangeMethod: 'PATCH'
    },

    checkChangeListeners: null,

    /**
     * 初始化checkChangeListeners
     */
    initialize() {
        let me = this,
            store = me.getStore(),
            model = store.getModel(),
            fieldsMap = model.fieldsMap,
            columns = me.getColumns(),
            checkChangeListeners = me.checkChangeListeners = [];
        Ext.each(columns, column => {
            if (column.xtype !== 'checkcolumn') return;
            let dataIndex = column.getDataIndex(),
                field = fieldsMap[dataIndex];
            if (field && (field.updateAction || field.checkAction || field.uncheckAction)) {
                checkChangeListeners.push(column.on('checkchange', me.onCheckChange, me));
            }
        });
    },

    /**
     * check列发生改变
     * @param {列} column 
     * @param {行号} rowIndex 
     * @param {已选/未选} checked 
     * @param {记录} record 
     * @param {事件} e 
     * @param {事件选项} eOpts 
     */
    onCheckChange(column, rowIndex, checked, record, e, eOpts) {
        var me = this;
        me.doCheckChange(record, column.dataIndex, checked);
    },

    /**
     * 默认判断是否有权限执行更新操作
     * @returns {Boolean} 是否有权限执行更新操作
     */

    beforeCheckChange() {
        let permissions = this.up('[permissions]').permissions;
        if(permissions && !permissions.update){
            Ext.toast(I18N.get('NoPermissionToUpdate'));
            return false;
        }
        return true;
    },

    /**
     * 执行复选框列的更新操作
     * @param {提交地址} url 
     * @param {记录} record 
     * @param {要更改的字段} field 
     */
    doCheckChange(record, fieldName, checked) {
        let me = this,        
            field = record.fieldsMap[fieldName];
        if (!field) return;
        let updateAction = field.updateAction,
            checkAction = field.checkAction,
            uncheckAction = field.uncheckAction,
            id = record.getId(),
            url,
            client = Http.getClient(me.getCheckChangeMethod());
        if(!client) Ext.raise('Http client not found');
        if (me.beforeCheckChange() === false) {
            store.rejectChanges();
            return;
        };

        if (updateAction) {
            url = me.getCheckChangeUrl( id, updateAction, checked);
        } else {
            action = checked ? checkAction : uncheckAction;
            if (Ext.isEmpty(action)) {
                url = me.getCheckChangeUrl(id);
                //if (!checked) request = Http.delete;
            } else {
                url = me.getCheckChangeUrl(id, action);
            }
        }
        client.apply(Http, [url, { id: id, field: fieldName }])
            .then(me.onCheckChangeSuccess, me.onCheckChangeFailure, null, me);
    },

    /**
     * 
     * @param {记录id} id 
     * @param {操作} action 
     * @param {是否已选} checked 
     * @returns 
     */
    getCheckChangeUrl( id, action, checked) {
        let entityName = this.getPluralizeEntityName();;
        return checked === undefined
            ? URI.get(entityName, id, action)
            : URI.get(entityName, id, action, checked)
    },

    /**
     * 更新成功
     * @param {提交响应返回值} response 
     */
    onCheckChangeSuccess(response) {
        let me = this,
            data = response.request.getJson(),
            store = me.getStore();
        if (data) {
            let record = store.getById(data.id),
                value = record && record.get(data.field);
            if (!Ext.isBoolean(value)) {
                let returnValue = Http.parseResponse(response);
                record.set(data.field, returnValue);
            }
        }
        store.commitChanges();
        Ext.toast(I18N.get('UpdateSuccess'));
        me.afterCheckChangeSuccess && me.afterCheckChangeSuccess();
    },

    /**
     * 更新失败
     * @param {提交响应返回值} response 
     */
    onCheckChangeFailure(response) {
        let error = response.request.getError();
        Ext.toast(error.message);
        this.getStore().rejectChanges();
    },


    doDestroy() {
        Ext.each(this.checkChangeListeners, listener => Ext.destroy(listener));
    }


})
