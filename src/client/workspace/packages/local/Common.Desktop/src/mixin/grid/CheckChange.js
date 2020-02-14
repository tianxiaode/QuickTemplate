Ext.define('Common.Desktop.mixin.grid.CheckChange', {
    mixinId: 'checkchangemixin',

    checkChangeUrl: null,

   /**
     * 复选框列发生改变时执行该操作
     * @param {列} column 
     * @param {行} rowIndex 
     * @param {值} checked 
     * @param {记录} record 
     * @param {事件} e 
     * @param {事件参数项} eOpts 
     */
    onColumnCheckChange: function (column, rowIndex, checked, record, e, eOpts) {
        var me = this,
            url = me.checkChangeUrl;
        if(Ext.isEmpty(url)) Ext.raise('No define check change url');
        me.doColumnCheckChange(url, record, column.dataIndex);
    },


    onColumnCheckChangeSuccess(response, opts){
        opts.record.commit();
        Ext.toast(I18N.Updated, null, 'bl');
    },
    /**
     * 执行复选框列的更新操作
     * @param {提交地址} url 
     * @param {记录} record 
     * @param {要更改的字段} field 
     */
    doColumnCheckChange: function (url, record, field) {
        var me = this,
            id = record.get('id');
        Ext.Ajax.request({
            url: url,
            method: 'PUT',
            record: record,
            jsonData: { id: id, field: field },
            success: me.onColumnCheckChangeSuccess,
            failure:function(response, opts){
                opts.record.reject();
                FAILED.ajax(response,opts);
            },
            scope: me
        });
    },
     
});