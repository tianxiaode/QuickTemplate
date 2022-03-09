Ext.define('Common.shared.mixin.Searchable', {
    extend: 'Ext.Mixin',

    searchFields: null, //所有查询字段

    
    initialSearchItemEvent(me){
        let fields = me.getSearchFields();
        fields.forEach(field=>{
            field.on('change', 'onSearch');
        });
        me.isInitialSearchItemEvent = true;
    },

    /**
     * 获取查询字段
     */
     getSearchFields(){
        let me = this,
            view = me.isViewController ? me.getView() : me,
            fields = me.searchFields;
        if(fields) return fields;
        fields = me.searchFields = view.query('field[isSearch]');
        return fields;
    },

    /**
     * 获取查询值
     */
    getSearchValues(){
        let me = this,
            fields = me.getSearchFields(),
            values = {},
            ln = fields.length;
        for(let i =0 ;i<ln;i++){
            let field = fields[i];
            if(!field.isValid()) return;
            if(field.isCheckbox && !field.isChecked()) continue;
            let fieldName = field.searchName,
                value = field.getValue();
            if(Ext.isEmpty(value)) continue;
            values[fieldName] = value;
        }
        if(me.validateSearchValue && !me.validateSearchValue(values)){
            return false;
        }
        return values;

    },

    /**
     * 触发查询
     */
    onSearch(){
        let me = this;
        if(!me.isInitialSearchItemEvent) return;
        let store  = me.getStore(),
            searchTask = me.searchTask;
        if(!store) return;
        if(!searchTask){
            searchTask = me.searchTask = new Ext.util.DelayedTask(me.doSearch, me);
        }

        searchTask.delay(500)
    },

    /**
     * 执行远程查询
     */
    doSearch(){
        let me = this;
        if(!Enums.isReady) {
            Enums.on('ready', me.doSearch, me, {single: true});
            return;
        };
        let values = me.getSearchValues(),
            store = me.getStore();
        if(!Ext.isObject(values)) return;
        if(!store.getRemoteFilter()){
            me.doLocalSearch(values);
            return;
        }
        let proxy = store.getProxy(),
            params = proxy.extraParams;
        if(!me.beforeSearch(values, params)) return;
        me.clearSearchValues(params);
        Ext.apply(params,values);
        me.onRefreshStore();
    },

    /**
     * 执行本地查询
     * @param {查询值}} values 
     */
    doLocalSearch(values){
        let me = this,
            store = me.getStore(),
            fields =store.localFilterFields,
            length = fields.length;
        store.filterValue = values.query;
        store.clearFilter();
        if(Ext.isEmpty(values.query)) return;
        if(length === 0) return;
        let fn = function(record){
            let find = false;
            for (let i = 0; i < length; i++) {
                let value  = record.get(fields[i]);
                if(Ext.isEmpty(value)) continue;
                find = value.toString().toLowerCase().includes(values.query.toLowerCase());
                if(find) break;                
            }
            return find;
        }
        store.filterBy(fn, me);
    },

    /**
     * 执行查询前的操作
     * @param {查询值}} values 
     */
    beforeSearch(values){return true;},

    /**
     * 清理查询值
     * @param {存储参数} params 
     * @param {查询值} values 
     */
    clearSearchValues(params){
        let fields = this.getSearchFields();
        if(!fields) return;
        fields.forEach(f=>{
            let k = f.searchName;
            if(params.hasOwnProperty(k)) delete params[k];
        });
    },



});