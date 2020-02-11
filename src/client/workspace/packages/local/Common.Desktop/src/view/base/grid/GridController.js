Ext.define('Common.Desktop.view.base.grid.GridController',{
    extend: 'Common.Desktop.view.base.ViewController',
    alias: 'controller.baseGrid',

    init:function(){
        let me = this,
            view = me.getView();
        view.on('storechange', me.onStoreChange, me);
        me.searchFields = view.query('field[isSearch]');
        if(view.getDoubleTapToEdit()){
            view.on('childdoubletap', me.onEditedEntity, me);
        }
    },

    //设置远程控制器名称
    remoteControllerName: null,

    /********************开始：选择操作****************************************/

    //当前选择
    currentSelections: new Set(),
    //在store为VirtualStore时，需要记录当前选择是全选还是部分选择
    isViewSelectAll: false,

    //获取当前选择的记录
    getCurrentSelections: function(){
        let me = this;
        let view = me.getView();
        return me.mainStore.isVirtualStore ?  Array.from(me.currentSelections) : view.getSelectable().getSelectedRecords();
    },

    /**
     * 选择记录
     * 如果store为VirtualStore，返回的是选择记录的索引，需要从store获取记录并记录
     * @param {事件触发者} sender 
     * @param {选择的记录} selected 
     * @param {事件选项} eOpts 
     */    
    onViewSelect: function(sender, selected, eOpts ){
        let me = this;
        let store = me.mainStore;
        if(store.isVirtualStore){
            let selections = me.currentSelections;
            let record = store.getAt(selected);
            if(record) selections.add(record);
        }
        //更Curd按钮状态
        me.updateCrudButtonState();
    },

    /**
     * 取消记录的选择     * 
     * @param {事件触发者} sender 
     * @param {选择的记录} records 
     * @param {事件选项} eOpts 
     */
    onViewDeselect: function(sender, records, eOpts){
        let me = this;
        me.isViewSelectAll = false;
        let [selections,store] = [me.currentSelections, me.mainStore ];
        if(store.isVirtualStore){
            let record = store.getAt(records);
            if(record) selections.delete(record);

            //修正取消选择bug
            let selectable = sender.getSelectable();
            selectable.updateHeaderState();
        }

        //需要更新列标题状态
        me.updateCrudButtonState();
    },

    /**
     * 该方法只有在store为VirtualStore时才会被绑定
     * 需要消除部分行没有选择的问题
     */
    onViewSelectAll: function(){
        let me = this;
        if(me.mainStore.isVirtualStore){
            let view = me.getView();
            let rows = view.el.query('.x-gridrow');
            for (const row of rows) {
                var el = Ext.fly(row);
                if(!el.hasCls('.x-selected')){
                    el.addCls('x-selected')
                }
            }
        }
        me.isViewSelectAll =true;
    },

    /**
     * 该方法只有在store为VirtualStore时才会被绑定
     * 需要消除部分行没有取消选择的问题
     */
    onViewDeselectAll: function(){
        let me = this;
        if(me.mainStore.isVirtualStore){
            let view = me.getView();
            let rows = view.el.query('.x-selected');
            for (const row of rows) {
                var el = Ext.fly(row);
                el.removeCls('x-selected')
            }    
        }
        me.isViewSelectAll =false;
    },


    /**********************结束：选择操作**************************************/

    /*************************开始：高亮提示相关操作******************************* */

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

    doAmountRenderer(value, record, dataIndex , cell,column, returnString){
        return Ext.util.Format.currency(value/100);
    },

    /*************************结束：高亮提示相关操作******************************* */

    doBoolValueRenderer(value, record, dataIndex , cell,column, returnString){
        return `<span class="x-fa fa-${value ? 'check' : 'times'} ${value ? 'green' : 'red'}"></span>`        
    },
    

    /*************************开始：复选框列相关操作******************************* */

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
            url = URI.get(me.getEntityName(),'updateCheckedField');
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
        me.send({
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
    /*************************结束：复选框列相关操作******************************* */


    /*************************开始：从枚举store获取状态值******************************* */

    getStateValueFromEnumsStore: function(prefix,value){
        let store = Ext.StoreMgr.lookup('EnumsStore');
        let find = store.getById(prefix+value);
        return find ? find.get('text') : value;

    },

    /*************************结束：从枚举store获取状态值******************************* */


    //绑定store后的操作
    onStoreChange: function(sender, store, oldStore, eOpts){
        let me = this;        
        if(sender.isPagingGrid && store && !store.isVirtualStore && !store.isTreeStore && me.initPaging){
            me.initPaging(store);
        }
        let eventPrefix = store.isVirtualStore ? 're' : '';
        store.on('before' + eventPrefix +  'load', me.onStoreBeforeLoad, me);
        store.on( eventPrefix + 'load', me.onStoreLoad, me);
        // if(store.isVirtualStore){
        //     store.on('beforereload', me.onStoreBeforeLoad, me);
        //     store.on( 'reload', me.onStoreLoad, me);    
        // }
        me.setMainStore(sender,store);
        if(sender.getAutoLoadStore())me.onRefreshStore();
    },

    //store加载后的处理
    onStoreLoad: function(store, records, successful, operation, eOpts){
        let me = this,  
            countMessage = me.getButtonByKey('countMessage');
        if(countMessage && successful){
            countMessage.setHtml(I18N.Count.replace('{0}', store.getTotalCount()));
        }
    },

    //store加载前的操作
    onStoreBeforeLoad:function(){
        this.doDeselectAll();
        return true;
    },

    //取消全部选择
    doDeselectAll(){
        let me = this;
        let [view,store] = [me.getView(), me.mainStore];
        let selectable = view.getSelectable();
        me.isViewSelectAll = false;        
        selectable.deselectAll();
        if(store.isVirtualStore){
            me.currentSelections.clear();
            selectable.updateHeaderState();    
        }
    },

    //获取实体名称
    getEntityName: function(){
        return this.getView().getEntityName();
    },

    //在设置主store之前的操作
    beforeSetMainStore: Ext.emptyFn,
    afterSetMainStore: Ext.emptyFn,

    //设置mainStore的值并绑定事件
    setMainStore: function(view,store){
        let me = this;
        me.beforeSetMainStore(view,store);
        me.mainStore = store;
        view.on('select', me.onViewSelect, me);
        view.on('deselect', me.onViewDeselect, me);
        if(store.isVirtualStore){
            let selectionModel = view.getSelectable();
            selectionModel.on('selectAll', me.onViewSelectAll,me);
            selectionModel.on('deselectAll', me.onViewDeselectAll,me);
    
        }
        me.afterSetMainStore();
        //初始化CRUD按钮的显示
        me.initCrudButtonHiddenState();
    },

    //获取按钮
    getButtonByKey: function(key){
        let buttons = this.getView()._buttons || this.getView().getButtons() ;
        return buttons.getItems().getByKey(key);
    },


    //设置按钮禁用状态
    setButtonDisabled: function(key,disabled){
        let button = this.getButtonByKey(key) ;
        if(button) button.setDisabled(disabled);
    },

    //设置按钮显示状态
    setButtonHidden(key,hidden){
        let button = this.getButtonByKey(key);
        if(button) button.setHidden(hidden);
    },

    //初始化CRUD按钮的显示
    initCrudButtonHiddenState(){
        let me = this,
            entityName = me.getEntityName();
        me.setButtonHidden('create', !ACL.isGranted('Pages.'+ entityName + '.Create'));
        me.setButtonHidden('edit', !ACL.isGranted('Pages.'+ entityName + '.Edit'));
        me.setButtonHidden('delete', !ACL.isGranted('Pages.'+ entityName + '.Delete'));
    },


    editButtonStateValidation(selections){
        if(selections.length <= 0) return true;
        return false;
    },

    deleteButtonStateValidation(selections){
        if(selections.length <= 0) return true;
        return false;
    },

    //附加编辑按钮状态验证
    additionalEditButtonStateValidation(){return false},
    //附加删除按钮状态验证
    additionalDeleteButtonStateValidation(){return false},
    /**
     * 更新CRUD按钮状态
     */
    updateCrudButtonState(){
        let me = this,
            selections = me.getCurrentSelections();
        me.setButtonDisabled('edit',  me.additionalEditButtonStateValidation(selections) || me.editButtonStateValidation(selections));
        me.setButtonDisabled('delete',me.additionalDeleteButtonStateValidation(selections) || me.deleteButtonStateValidation(selections));
    },
    
    //刷新Grid
    onRefreshStore: function(){
        let me = this;
        let store = me.mainStore;
        if(store.isVirtualStore) {
            store.reload();
            return;
        }
        if(store.isTreeStore){
            let selection = me.getCurrentSelections()[0];
            store.load({node: selection? selection : store.getRoot()})
            return;
        }
        store.load();
    },

    /**********************开始：增删改操作**************************************/

    /**
     * 获取编辑窗口，如果窗口不存在，调用Common.Shared.util.Config的getDialog创建窗口
     */
    currentEditView:{},
    getEditView: function(xtype,callback){
        let me = this;
        let entityName = me.getEntityName();
        xtype = xtype || entityName.toLowerCase() + 'EditView';
        let edit = me.currentEditView[xtype];
        let fn = callback || me.onEditViewHide;
        if(!edit){
            edit = me.currentEditView[xtype] = DialogManager.getDialog(
                xtype,
                { 
                    entityName:  entityName, 
                    callback: {fn: fn ,scope: me},
                }
            );
            if(!Ext.isEmpty(me.remoteControllerName)) 
                edit.setSubmitUrl(me.remoteControllerName);
        }
        if(!edit) Ext.raise('No view:' + xtype);
        return edit;
    },

    beforeAdded: function(){
        return true;
    },

    //新建实体
    onAddedEntity: function(){
        let dlg = this.getEditView();
        if(this.beforeAdded(dlg)){
            dlg.addRecord(true);
            dlg.show();
        }
    },

    beforeEdited: function(){
        return true;
    },

    //编辑实体
    onEditedEntity: function(){
        let me = this;
        let [dlg, selection] = [me.getEditView(), me.getCurrentSelections()[0] ];
        if (!selection) {
            Ext.Msg.alert(I18N.DefaultMessageTitle, Ext.String.format(I18N.NoSelection, I18N[me.getEntityName()], I18N.Edit));
            return;
        }
        if(me.beforeEdited(dlg,selection)){
            dlg.setRecord(null);
            dlg.editRecord(selection,true);
            dlg.show();    
        }
    },

    //新建或编辑实体后的回调函数，主要用于刷新存储
    onEditViewHide: function(form, isSavedSuccess, hasNewInSaved){
        if(hasNewInSaved){
            this.onRefreshStore();
        }
    },

    // 用户过滤不能删除的记录
    filterByBeforeDeleted: function(){return true},

    /**
     * 从模型定义中获取字段
     */
    getDeleteMessageField(){
        let store = this.mainStore,
            model = store.getModel(),
            fields = model.getFields(),
            field = fields.find(m=>m.isDeleteMessageField);
        return field.name;
    },

    //开始删除操作
    onDeletedEntity: function(){
        let me = this,
            store = me.mainStore,
            entityName = me.getEntityName(),
            msgField = me.getDeleteMessageField(),
            selections = me.getCurrentSelections(),
            url = URI.get( me.remoteControllerName || entityName, 'delete');
        if(store.isVirtualStore && me.isViewSelectAll){
            let proxy = store.getProxy();
            let params = Ext.clone(proxy.extraParams);
            params['isAll'] = true;
            Ext.Msg.confirm(I18N.DeleteConfirmMessageTitle, I18N.DeleteAllConfirmMessage, 
                function (btn) {
                    if (btn === "yes") {
                        me.send(
                            {
                                method: 'DELETE',
                                url: url,
                                params: Ext.clone(params),
                                success: me.onDeletedSuccess
                            }, 
                            I18N.DeleteWaitMsg
                        );
                    }
                }    
            )
            return;

        }
        selections = selections.filter(me.filterByBeforeDeleted);
        if(Ext.isEmpty(msgField)) Ext.raise('No define deleteMessageField');
        me.doDelete(selections,
            url,
            msgField,
            I18N[entityName],
            me.onDeletedSuccess);
    },

    onDeletedSuccessCallBack:Ext.emptyFn,
    //删除操作的回调函数
    onDeletedSuccess(response, opts){
        let me = this,
            obj = Ext.decode(response.responseText, true), 
            msg = '';
        Ext.Viewport.unmask();
        if (obj.success) {
            me.onDeletedSuccessCallBack(obj);
            me.onRefreshStore();
            msg = Ext.isArray(obj.result) ? obj.result.join('') : I18N.DeleteSuccess;
        }else{
            msg = obj.error.message;
        }
        Ext.toast(msg, null, 'bl');

    },

    //发送请求
    send: function (config, waitMsg) {
        var me = this,
            cfg = Ext.apply({
                scope: me,
                failure: function (response, opts) {
                    Ext.Viewport.unmask();
                    FAILED.ajax(response, opts);
                }
            }, config);
        if (!Ext.isEmpty(waitMsg)) Ext.Viewport.mask(waitMsg);
        Ext.Ajax.request(cfg);
    },

    //删除操作确认信息的模版
    deletedMessageTemplate:[
        '<div class="message-tips">',
        '<ul class="message-tips-list">',
        '<tpl for=".">', 
        '<li class="x-fa pointthree">{.}</li>',
        '</tpl>',
        '</div>'
    ],

    //生成
    buildDeletedMessage: function(){
        var me = this,
            template = me.deletedMessageTemplate;
        if(Ext.isArray(template)){
            template = me.deletedMessageTemplate = new Ext.XTemplate(template);
        }
        return template;
    },

    //执行删除操作
    doDelete: function (selections, url, msgField, entityName, success) {
        let [me,fm,ln,ids,contents] = [this,Ext.String.format,selections.length,[],[]];

        //如果没有要删除记录，显示提示
        if (ln === 0) {
            Ext.Msg.alert(I18N.DefaultMessageTitle, fm(I18N.DeleteNoSelection, entityName));
            return;
        }
        //组织确认提示信息
        for (const record of selections) {
            ids.push(record.getId());
            contents.push(record.get(msgField));            
        }
        //确认后执行删除
        Ext.Msg.confirm(
        	I18N.DeleteConfirmMessageTitle, 
        	fm(I18N.DeleteConfirmMessage, entityName, me.buildDeletedMessage().apply(contents)),
            function (btn) {
                if (btn === "yes") {
                    me.send(
	                    {
                            method: 'DELETE',
	                        url: url,
	                        params: { id: ids },
	                        success: success
	                    }, 
	                    I18N.DeleteWaitMsg
                    );
                }
            },
            me
        );
    },

    /**********************结束：增删改操作**************************************/

    /**********************开始：基本搜索操作**************************************/

    /**
     * 添加搜索值之前的操作，用于附近的搜索值验证
     * @param {字段名} fieldName 
     * @param {值} value 
     * 返回true表示添加，false表示不添加
     */
    beforeAddedSearchValue: function(fieldName,value){ return true},

    //获取搜索值
    getSearchValues: function(){
        let me = this;
        let [view, values ]= [me.getView(), {}];
        for (const field of me.searchFields) {
            //let field = me.getSearchField(view, fieldName);
            if(!field.isValid()){  
                return;
            }
            if(field.isCheckbox && !field.isChecked()) continue;
            let fieldName = field.searchName;
            let value = field.serialize();
            if(Ext.isEmpty(value)) continue;
            if(!me.beforeAddedSearchValue(fieldName,value)) continue;
            values[fieldName] = value;
        }
        return values;

    },

    //执行搜索之前的操作
    beforeSearch: function(values){
        if(Ext.Object.getKeys(values).length === 0){
            Ext.Msg.alert(I18N.DefaultMessageTitle, I18N.NoSearchValue);
            return false;
        }
        return true;
    },

    //执行搜索操作
    doSearch: function(){
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

    clearSearchValues(params){
        let fields = this.searchFields;
        for (const field of fields) {
            let name = field.searchName;
            if(params.hasOwnProperty(name)) delete params[name];
        }
    },

    //重置搜索值
    resetSearchValues(){
        let fields = this.searchFields;
        fields.forEach(field=>{
            if(Ext.isFunction(field.getStore)){
                let store = field.getStore();
                field.setValue(store.getAt(0));
                return;
            }
            field.setValue(null);
        });
    },

    //取消搜索
    doCancelSearch: function(){
        let me = this;
        let store =  me.mainStore;
        let proxy = store.getProxy();
        let params = proxy.extraParams;
        me.clearSearchValues(params);
        me.resetSearchValues();
        if(store.isVirtualStore) {
            store.reload();
            return;
        }
        store.loadPage(1);
    },

    //获取查询字段
    getSearchField(view, fieldName){
        return view.down('#'+fieldName) || view.down('field[searchName='+fieldName+']');
    },

    //初始化查询字段值
    initSearchFieldValues(fieldName, values){
        let me = this;
        let field = me.getSearchField(me.getView(), fieldName);
        let store = field.getStore();
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


    /**********************结束：基本搜索操作**************************************/

})