/**
 * 一些程勇的网格渲染函数
 */
Ext.define('Common.Desktop.mixin.grid.Renderer', {
    mixinId: 'renderermixin',

    /**
     * 根据查询值高亮显示
     * @param {显示值} value 
     * @param {记录} record 
     * @param {数据索引} dataIndex 
     * @param {单元格} cell 
     * @param {列} column 
     * @param {返回值} returnString 
     */
    doHighLightRenderer: function (value, record, dataIndex , cell,column, returnString) {
        if(Ext.isEmpty(value)) return value;
        let me = this,
            store = me.mainStore;
        if(store){
            let proxy = store.getProxy(),
                query = proxy.extraParams['query'] || proxy.extraParams['Query'],
                v = Ext.isString(value) ? value : value.toString();
            return Ext.isEmpty(query) ? v : v.replace(new RegExp('(' + query + ')', "gi"), '<span style="color:red;">$1</span>');
        }
    },

    /**
     * 渲染货币值
     * @param {显示值} value 
     * @param {记录} record 
     * @param {数据索引} dataIndex 
     * @param {单元格} cell 
     * @param {列} column 
     * @param {返回值} returnString 
     */
    doAmountRenderer(value, record, dataIndex , cell,column, returnString){
        return Ext.util.Format.currency(value/100);
    },

    /**
     * 渲染布尔值
     * @param {显示值} value 
     * @param {记录} record 
     * @param {数据索引} dataIndex 
     * @param {单元格} cell 
     * @param {列} column 
     * @param {返回值} returnString 
     */

    doBoolValueRenderer(value, record, dataIndex , cell,column, returnString){
        return `<span class="x-fa fa-${value ? 'check' : 'times'} ${value ? 'green' : 'red'}"></span>`        
    },

    /**
     * 从枚举存储获取枚举值
     * @param {前缀} prefix 
     * @param {值} value 
     */
    getStateValueFromEnumsStore: function(prefix,value){
        let store = Ext.StoreMgr.lookup('EnumsStore'),
            find = store.getById(prefix+value);
        return find ? find.get('text') : value;
    },

});