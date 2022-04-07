Ext.define('Common.ux.crud.controller.mixin.CheckChange',{
    extend: 'Ext.Mixin',

        /**
     * check列发生改变
     * @param {列} column 
     * @param {行号} rowIndex 
     * @param {已选/未选} checked 
     * @param {记录} record 
     * @param {事件} e 
     * @param {事件选项} eOpts 
     */
    onColumnCheckChange(column, rowIndex, checked, record, e, eOpts) {
        var me = this;
        if(!me.isGranted(me.permissions.update)) return;
        me.doColumnCheckChange(record, column.dataIndex, checked);
    },
    
    /**
     * 执行复选框列的更新操作
     * @param {提交地址} url 
     * @param {记录} record 
     * @param {要更改的字段} field 
     */
    doColumnCheckChange(record, field, checked) {
        let me = this,
            store = me.getStore(),
            updateAction = store.updateAction,
            checkAction = store.checkAction,
            uncheckAction = store.uncheckAction,
            entityName = me.entityName,
            id = record.getId(),
            url;
        if(updateAction){
            url = URI.crud(entityName,id,updateAction[field], checked);
        }else{
            action = checked ? checkAction[field] : uncheckAction[field];
            url = URI.crud(entityName,id, action);
        }
        Http.patch(url,{id: id, field: field}).then(me.onColumnCheckChangeSuccess, me.onColumnCheckChangeFailure, null, me);
    },

    /**
     * 更新成功
     */
    onColumnCheckChangeSuccess(response){
        let me = this;
            request = response.request,
            data = request && request.jsonData,
            store = me.getStore();
        if(data){
            let record = store.getById(data.id),
                value = record && record.get(data.field);
            if(!Ext.isBoolean(value)){
                let returnValue = Http.parseResponse(response);
                record.set(data.field, returnValue);
            }
        }
        store.commitChanges();
        Toast(I18N.get('UpdateSuccess'));
    },

    /**
     * 更新失败
     */
    onColumnCheckChangeFailure(response){
        this.getStore().rejectChanges();
        this.onAjaxFailure(response);
    },
    
    
})
