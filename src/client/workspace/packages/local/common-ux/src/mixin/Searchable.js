Ext.define('Common.mixin.Searchable', {
    extend: 'Common.mixin.Base',

    config:{
        searchFields: null, //所有查询字段
    },

    searchTask: null,

    updateSearchFields(fields){
        let me = this;
        me.fieldChangeListeners = [];
        Ext.each(fields, f => {
            if (!f.autoSearch) return;
            me.fieldChangeListeners.push(f.on('change', me.onSearch, me, { destroyable: true }));
        });
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
    onSearch() {
        let me = this,
            searchTask = me.searchTask;
        if (!searchTask) {
            searchTask = me.searchTask = new Ext.util.DelayedTask(me.doSearch, me);
        }
        searchTask.delay(500);
    },

    /**
     * 查询前执行的操作，返回false可取消查询
     * @param {查询值} values 
     */
    onBeforeSearch(values) {
        Logger.debug(this.onBeforeSearch, values);
    },

    /**
     * 执行查询
     * @returns 
     */
    doSearch() {
        let me = this,
            values = me.getSearchValues(),
            store = me.getStore();
        // if(Ext.Object.isEmpty(values)){
        //     Ext.toast(I18N.get('SearchValueEmpty'));
        //     return;
        // }
        if (me.onBeforeSearch(values) === false) return;
        if (!Ext.isObject(values)) return;
        if (!store.getRemoteFilter()) {
            me.doLocalSearch(values);
            return;
        }
        store.setExtraParams(values, true);
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
     * 重置搜索字段值
     */
    onResetSearchFields(){
        let fields = this.getSearchFields();
        Ext.each(fields, f=>{
            f.reset && f.reset();
        })
    },

    doDestroy(){
        let me = this;
        Ext.each(me.fieldChangeListeners, e=>{
            Ext.destroy(e);
        })
        me.setSearchFields(null);
        me.searchTask = null;
    }


});