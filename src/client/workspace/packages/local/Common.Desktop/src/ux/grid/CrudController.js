Ext.define('Common.Desktop.ux.grid.CrudController',{
    extend: 'Common.Shared.ux.app.ViewController',
    alias: 'controller.crudgrid',

    mixins:[
        'Common.Desktop.mixin.grid.Renderer',
        'Common.Desktop.mixin.grid.Search',
        'Common.Desktop.mixin.grid.ButtonState',
    ],

    init(){
        let me = this,
            view = me.getView();
        //绑定storechange事件
        view.on('storechange', me.onStoreChange, me);
        //如果设置了双击打开编辑对话框，则绑定childdoubletap事件
        if(view.getDoubleTapToEdit()){
            view.on('childdoubletap', me.onEditedEntity, me);
        }
    },

    /**
     * 远程控制器的名称
     */
    remoteControllerName: null,


    /**
     * 当前的网格的选择行
     */
    currentSelections: new Set(),
    
    /**
     * 在store为VirtualStore时，需要记录当前选择是全选还是部分选择
     */
    isViewSelectAll: false,

    /**
     * 获取当前选择的记录
     */
    getCurrentSelections(){
        let me = this,
            view = me.getView();
        return me.mainStore.isVirtualStore ?  Array.from(me.currentSelections) : view.getSelectable().getSelectedRecords();
    },

    /**
     * 选择记录
     * 如果store为VirtualStore，返回的是选择记录的索引，需要从store获取记录并记录
     * @param {事件触发者} sender 
     * @param {选择的记录} selected 
     * @param {事件选项} eOpts 
     */    
    onViewSelect(sender, selected, eOpts ){
        let me = this,
            store = me.mainStore;
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
    onViewDeselect(sender, records, eOpts){
        let me = this,
            store = me.mainStore,
            selections = me.currentSelections;
        me.isViewSelectAll = false;
        if(store.isVirtualStore){
            let record = store.getAt(records);
            if(record) selections.delete(record);

            //修正取消选择bug
            let selectable = sender.getSelectable();            
            if(selectable) selectable.updateHeaderState();
        }

        //需要更新列标题状态
        me.updateCrudButtonState();
    },

    /**
     * 该方法只有在store为VirtualStore时才会被绑定
     * 需要消除部分行没有选择的问题
     */
    onViewSelectAll(){
        let me = this,
            store = me.mainStore;
        if(store.isVirtualStore){
            let view = me.getView(),
                rows = view.el.query('.x-gridrow');
            rows.forEach(row=>{
                let el = Ext.fly(row);
                if(el.hasCls('.x-selected')) return;
                el.addCls('x-selected')
            })
        }
        me.isViewSelectAll =true;
    },

    /**
     * 该方法只有在store为VirtualStore时才会被绑定
     * 需要消除部分行没有取消选择的问题
     */
    onViewDeselectAll(){
        let me = this,
            store = me.mainStore;
        if(store.isVirtualStore){
            let view = me.getView(),
                rows = view.el.query('.x-selected');
            rows.forEach(row=>{
                let el = Ext.fly(row);
                el.removeCls('x-selected');
            })
        }
        me.isViewSelectAll =false;
    },

    /**
     * 网格的存储改变后会执行该操作
     * @param {事件触发者} sender 
     * @param {存储} store 
     * @param {旧存储} oldStore 
     * @param {事件对象} eOpts 
     */
    onStoreChange(sender, store, oldStore, eOpts){
        let me = this; 
        //如果网格带分页功能，需要调用initPage方法来初始化分页组件       
        if(sender.isPagingGrid && store && !store.isVirtualStore && !store.isTreeStore && me.initPaging){
            me.initPaging(store);
        }
        let eventPrefix = store.isVirtualStore ? 're' : '';
        store.on('before' + eventPrefix +  'load', me.onStoreBeforeLoad, me);
        store.on( eventPrefix + 'load', me.onStoreLoad, me);
        me.setMainStore(sender,store);
        //如果设置了自动加载存储，执行加载存储操作
        if(sender.getAutoLoadStore())me.onRefreshStore();
    },

    /**
     * 存储加载后的处理
     * @param {*} store 
     * @param {*} records 
     * @param {*} successful 
     * @param {*} operation 
     * @param {*} eOpts 
     */
    onStoreLoad(store, records, successful, operation, eOpts){
        let me = this,  
            countMessage = me.getButtonByKey('countMessage');
        //更新记录总数
        if(countMessage && successful){
            countMessage.setCount(store.getTotalCount());
        }
    },

    /**
     * store加载前的操作
     */
    //
    onStoreBeforeLoad(){
        //取消全选
        this.doDeselectAll();
        return true;
    },

    /**
     * 取消全选
     */
    doDeselectAll(){
        let me = this,
            view = me.getView(),
            store = me.mainStore,
            selectable = view.getSelectable();
        me.isViewSelectAll = false;
        if(!selectable) return;
        selectable.deselectAll();
        if(store.isVirtualStore){
            me.currentSelections.clear();
            selectable.updateHeaderState();    
        }
    },

    /**
     * 设置主存储前的操作
     */
    beforeSetMainStore: Ext.emptyFn,
    /**
     * 设置主存储后的操作
     */
    afterSetMainStore: Ext.emptyFn,

    /**
     * 设置主存储
     * @param {视图} view 
     * @param {存储} store 
     */
    setMainStore(view,store){
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

    
    /**
     * 刷新存储
     */
    onRefreshStore(){
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


    /**
     * 获取编辑窗口
     */
    currentEditView:{},
    getEditView(xtype,callback){
        let me = this,
            entityName = me.getEntityName();
        xtype = xtype || entityName.toLowerCase() + 'editview';
        let edit = me.currentEditView[xtype];
        let fn = callback || me.onEditViewHide;
        if(edit) return edit;
        edit = me.currentEditView[xtype] = DialogManager.getDialog(
            xtype,
            { 
                entityName:  entityName, 
                callback: {fn: fn ,scope: me},
            }
        );
        if(!Ext.isEmpty(me.remoteControllerName)) 
            edit.setSubmitUrl(me.remoteControllerName);
        if(!edit) Ext.raise('No view:' + xtype);
        return edit;
    },

    /**
     * 添加实体前的操作
     */
    beforeAdded(){
        return true;
    },

    /**
     * 添加实体
     */
    onAddedEntity(){
        let dlg = this.getEditView();
        if(this.beforeAdded(dlg)){
            dlg.addRecord(true);
            dlg.show();
        }
    },

    /**
     * 编辑实体前的操作
     */
    beforeEdited(){
        return true;
    },

    /**
     * 编辑实体
     */
    onEditedEntity(){
        let me = this,
            dlg = me.getEditView(),
            selection =me.getCurrentSelections()[0];
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

    /**
     * 新建或编辑实体后的回调函数，主要用于刷新存储
     * @param {表单} form 
     * @param {是否保存成功} isSavedSuccess 
     * @param {是否有新记录} hasNewInSaved 
     */
    onEditViewHide(form, isSavedSuccess, hasNewInSaved){
        if(hasNewInSaved){
            this.onRefreshStore();
        }
    },

    // 过滤不能删除的记录
    filterByBeforeDeleted(){return true},

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

    /**
     * 删除操作
     */
    onDeletedEntity(){
        let me = this,
            store = me.mainStore,
            entityName = me.getEntityName(),
            msgField = me.getDeleteMessageField(),
            selections = me.getCurrentSelections(),
            url = URI.get( me.remoteControllerName || entityName, 'delete');
        //如果是虚拟存储，而且是全部删除，则提交查询参数
        if(store.isVirtualStore && me.isViewSelectAll){
            me.doDeleteAll();
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

    /**
     * 执行删除操作
     * @param {选择记录} selections 
     * @param {访问地址} url 
     * @param {信息字段}} msgField 
     * @param {实体名称} entityName 
     * @param {是否成功}} success 
     */
    //执行删除操作
    doDelete(selections, url, msgField, entityName, success) {
        let me = this,
            fm = Ext.String.format,
            ids = [],
            contents= [];

        //如果没有要删除记录，显示提示
        if (selections.length <= 0) {
            Ext.Msg.alert(I18N.DefaultMessageTitle, fm(I18N.DeleteNoSelection, entityName));
            return;
        }
        //组织确认提示信息
        selections.forEach(selection=>{
            ids.push(selection.getId());
            contents.push(selection.get(msgField));            
        })
        //确认后执行删除
        Ext.Msg.confirm(
        	I18N.DeleteConfirmMessageTitle, 
        	fm(I18N.DeleteConfirmMessage, entityName, me.getDeletedMessageTemplate().apply(contents)),
            function (btn) {
                if (btn === "yes") {
                    me.getView().mask(I18N.DeleteWaitMsg);
                    Ext.Ajax.request({
                        method: 'DELETE',
                        url: url,
                        params: { id: ids },
                        success: success,
                        failure: me.onAjaxFailure,
                        scope: me
                    })
                }
            },
            me
        );
    },

    /**
     * 根据查询参数删除全部记录
     */
    doDeleteAll(){
        let me = this,
            store = me.mainStore,
            proxy = store.getProxy(),
            params = Ext.clone(proxy.extraParams);
        params['isAll'] = true;
        Ext.Msg.confirm(I18N.DeleteConfirmMessageTitle, I18N.DeleteAllConfirmMessage, 
            function (btn) {
                if (btn === "yes") {
                    me.getView().mask(I18N.DeleteWaitMsg);
                    Ext.Ajax.request({
                        method: 'DELETE',
                        url: url,
                        params: Ext.clone(params),
                        success: me.onDeletedSuccess,
                        failure: me.onAjaxFailure,
                        scope: me
                    });
                }
            }    
        )

    },


})