Ext.define('Common.Desktop.mixin.grid.Search', {
    mixinId: 'searchmixin',

    /**
     * 获取全部查询字段
     */
    getSearchFields(){
        //获取并记录全部查询字段
        let me = this,
            fields = me.searchFields;
        if(fields) return fields;
        fields = me.searchFields = me.getView().query('field[isSearch]');
        return fields;
    },

    /**
     * 添加查询值之前的操作，用于查询值的附加验证
     * @param {字段名} fieldName 
     * @param {值} value 
     * 返回true表示添加，false表示不添加
     */
    beforeAddedSearchValue(fieldName,value){ return true},

    /**
     * 获取查询值
     */
    getSearchValues(){
        let me = this,
            view = me.getView(),
            vales = {},
            searchFields = me.getSearchFields();
        for (const field of me.searchFields) {
            if(!field.isValid())  return;            
            if(field.isCheckbox && !field.isChecked()) continue;
            let fieldName = field.searchName,
                value = field.serialize();
            if(Ext.isEmpty(value)) continue;
            if(!me.beforeAddedSearchValue(fieldName,value)) continue;
            values[fieldName] = value;
        }
        return values;
    },

    /**
     * 执行查询前的操作
     * @param {值} values 
     */
    beforeSearch(values){
        if(Ext.Object.getKeys(values).length === 0){
            Ext.Msg.alert(I18N.DefaultMessageTitle, I18N.NoSearchValue);
            return false;
        }
        return true;
    },

    /**
     * 执行查询
     */
    doSearch(){
        let me = this,
            store = me.mainStore, 
            values = me.getSearchValues(),
            proxy = store.getProxy(),
            params = proxy.extraParams;
        if(me.searchFields.length === 1 && Ext.isEmpty(params.query) && Ext.isEmpty(values.query)) return;
        if(me.searchFields.length === 1 && !Ext.isEmpty(params.query) && Ext.isEmpty(values.query)) {
            me.doCancelSearch();
            return;
        };
        if(!me.beforeSearch(values)) return;
        //Ext.Object.clear(params);
        me.clearSearchValues(params);
        Ext.apply(params,values);
        if(store.isVirtualStore) {
            store.reload();
            return;
        }
        store.loadPage(1);
    },

    /**
     * 清理查询值
     * @param {参数} params 
     */
    clearSearchValues(params){
        let fields = this.getSearchFields();
        fields.forEach(field=>{
            let name = field.searchName;
            if(params.hasOwnProperty(name)) delete params[name];
        });
    },

    /**
     * 重置查询值
     */
    resetSearchValues(){
        let fields = this.getSearchFields();
        fields.forEach(field=>{
            if(Ext.isFunction(field.getStore)){
                let store = field.getStore();
                field.setValue(store.getAt(0));
                return;
            }
            field.setValue(null);
        });
    },

    /**
     * 取消查询
     */
    doCancelSearch: function(){
        let me = this,
            store =  me.mainStore,
            proxy = store.getProxy(),
            params = proxy.extraParams;
        me.clearSearchValues(params);
        me.resetSearchValues();
        if(store.isVirtualStore) {
            store.reload();
            return;
        }
        store.loadPage(1);
    },

    /**
     * 根据字段名获取字段
     * @param {字段名}} fieldName 
     */
    getSearchFieldByName(fieldName){
        let fields  = me.getSearchFields(),
            find = fields.find(filed=>{filed.searchName === fieldName});
        return find;
    },

    /**
     * 初始化查询字段值
     * @param {字段名} fieldName 
     * @param {值} values 
     */
    initSearchFieldValues(fieldName, values){
        let me = this,
            field = me.getSearchFieldByName(fieldName),
            store = field.getStore();
        if(values.isCollection){
            values.each(item=>{
                store.add({ id: item.get('value'), text: item.get('text') });
            });
        }else{
            for (const v of values) {            
                if(v.permission && ACL.isGranted(v.permission)){
                    store.add(v);
                }else{
                    store.add(v);
                }
            }    
        }
        field.setValue(store.getAt(0).getId());

    }

});