Ext.define('Common.mixin.Searchable', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        after:{
            onStoreChange: 'onStoreChange'
        },
        before:{
            destroy: 'destroy',
        }
    },

    searchFields: null, //所有查询字段
    searchTask: null,
    hasInitSearchItemEvent: false,
    
    onStoreChange(){
        let me = this,
            fields = me.getSearchFields();
        fields.forEach(field=>{
            field.on('change', 'onSearch');
        });
        me.hasInitSearchItemEvent = true;
    },

    /**
     * 获取查询字段
     */
    getSearchFields(){
        let me = this,
            view = me.getView(),
            fields = me.searchFields;
        if(fields) return fields;
        fields = me.searchFields = view.query('field[isSearch],uxenumerationbutton');
        return fields;
    },

    /**
     * 获取查询值
     */
    getSearchValues(){
        let me = this,
            fields = me.getSearchFields(),
            values = {};
        Ext.each(fields,field=>{
            let name = field.searchName;
            if(field.isButton){
                values[name] = field.getValue();
                return;
            }
            if(!field.isValid()) return false;
            if(field.isCheckbox && !field.isChecked()) return;

            let value = field.getValue();
            if(Ext.isEmpty(value)) return;
            values[name] = value;

        })
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
        if(!me.hasInitSearchItemEvent) return;
        let store  = me.getStore(),
            searchTask = me.searchTask;
        if(!store) return;
        if(!searchTask){
            searchTask = me.searchTask = new Ext.util.DelayedTask(me.doSearch, me);
        }

        searchTask.delay(500);
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
            length = fields.length,
            filter = values.filter;
        store.filterValue = filter;
        store.clearFilter();
        if(Ext.isEmpty(filter)) return;
        if(length === 0) return;
        let fn = function(record){
            let find = false;
            Ext.each(fields, field=>{
                let value = record.get(field);
                if(Ext.isEmpty(value)) return;
                find = value.toString().toLowerCase().includes(filter.toLowerCase());
                if(find) return false;

            })
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

    destroy(){
        this.searchFields = null;
        this.searchTask = null;

    }


});