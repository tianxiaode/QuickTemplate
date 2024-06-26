Ext.define('Common.mixin.controller.CheckChange',{
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
    onCheckChange(column, rowIndex, checked, record, e, eOpts) {
        var me = this;
        me.doCheckChange(record, column.dataIndex, checked);
    },

    beforeCheckChange(){
        return this.permissions.update;
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
        if(!field) return;
        let updateAction = field.updateAction,
            checkAction = field.checkAction,
            uncheckAction = field.uncheckAction,
            entityName = me.entityName,
            id = record.getId(),
            url,
            request = Http.patch;
        if(!me.beforeCheckChange()) {
            store.rejectChanges();
            return;
        };

        if(updateAction){
            url = me.getCheckChangeUrl(entityName, id, updateAction, checked);
        }else{
            action = checked ? checkAction : uncheckAction;
            if(Ext.isEmpty(action)){
                url = me.getCheckChangeUrl(entityName, id);
                if(!checked) request = Http.delete;
            }else{
                url = me.getCheckChangeUrl(entityName, id, action);
            }
        }
        request.apply(Http ,[url,{id: id, field: fieldName}])
            .then(me.onCheckChangeSuccess, me.onCheckChangeFailure, null, me);
    },

    getCheckChangeUrl(entityName, id, action, checked){
        return checked === undefined 
            ? URI.crud(entityName,id, action)
            : URI.crud(entityName,id,action, checked)
    },

    /**
     * 更新成功
     */
    onCheckChangeSuccess(response){
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
        me.afterCheckChangeSuccess && me.afterCheckChangeSuccess();
    },

    /**
     * 更新失败
     */
    onCheckChangeFailure(response){
        this.getStore().rejectChanges();
        this.onAjaxFailure(response);
    },
    
    onCheckBoxTap(field, record){
        if(!field) return;
        let me = this,
            value = record.get(field),
            old = Ext.isBoolean(value) ? value :  !Ext.isEmpty(value),
            checked = !old;
        Ext.isBoolean(value) && record.set(field, checked );
        me.doCheckChange(record, field, checked);
    },

})
