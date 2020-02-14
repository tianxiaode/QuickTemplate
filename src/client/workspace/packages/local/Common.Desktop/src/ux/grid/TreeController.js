Ext.define('Common.Desktop.ux.grid.TreeController',{
    extend: 'Common.Shared.ux.app.ViewController',
    alias: 'controller.uxtree',

    deleteMessageField: 'displayName',

    mixins:[
        'Common.Desktop.mixin.grid.ButtonState',
        'Common.Desktop.mixin.grid.DeletedMessageTemplate',
    ],

    init(){
        let me = this,
            view = me.getView(),
            listView = me.listView = view.down('list'),
            treeView = me.treeView = view.down('tree');
        me.currentView = treeView;
        listView.on('storechange', me.onSearchTreeStoreChange, me);
        treeView.on('storechange', me.onTreeStoreChange, me);
        listView.setItemTpl([
            '<div class="row">',
            '<div class="col-5">{parentName:defaultValue}</div>',
            '<div class="col-7">{displayName:this.query}</div>',
            '</div>',
            {
                query: Ext.bind(me.onListViewRenderItem, me)
            }
        ]);
    },

    /**
     * 根据查询值高亮显示
     * @param {值} value 
     */
    onListViewRenderItem(value){
        let store = this.searchTreeStore,
            query = store.getProxy().extraParams.query;
        return value.replace(new RegExp(query,'ig'), '<span style="color:red;">' + query +'</span>');
    },

    /**
     * 获取当前选择
     */
    getCurrentSelections(){
        let me = this,
            view = me.currentView;
        return view.getSelectable().getSelectedRecords();
    },

    /**
     * 绑定查询存储时，绑定选择事件
     * @param {*} sender 
     * @param {*} store 
     * @param {*} oldStore 
     * @param {*} eOpts 
     */
    onSearchTreeStoreChange(sender, store, oldStore, eOpts){
        let me = this;
        me.searchTreeStore = store;
        store.on('beforeload', me.onSearchTreeStoreBeforeLoad,me);
        store.on('load', me.onSearchTreeStoreLoad,me);
        store.getProxy().setUrl(URI.get(me.getEntityName(),'getAllQuery'));
        me.bindSelectEvents(sender);
        //me.onRefreshStore();
    },

    /**
     * 查询存储加载前取消所以选择
     */
    onSearchTreeStoreBeforeLoad(){
        this.listView.getSelectable().deselectAll();
    },

    /**
     * 查询存储加载后选择默认记录
     */
    onSearchTreeStoreLoad(store, records, successful, operation, eOpts ){
        if(records.length>0){
            let record = records[0]
            this.listView.getSelectable().select(record);
        }
    },

    /**
     * 
     * @param {初始化根节点} store 
     */
    initRoot(store){
        let root = store.getRoot();
        root.set('displayName',I18N.All + I18N[this.getEntityName()]);
        root.commit();
        return root;
    },

    /**
     * 绑定树村上时，绑定选择时间
     * @param {} sender 
     * @param {*} store 
     * @param {*} oldStore 
     * @param {*} eOpts 
     */
    onTreeStoreChange(sender, store, oldStore, eOpts){
        let me = this;
        me.treeStore = store;
        let root = me.initRoot(store);
        store.getProxy().setUrl(URI.get(me.getEntityName(),'read'));
        store.on('load', me.onTreeStoreLoad,me);
        me.bindSelectEvents(sender);
        me.initCrudButtonHiddenState();        
        sender.getSelectable().select(root);
        me.onRefreshStore();
    },

    /**
     * 树加载后的操作
     * @param {}} store 
     * @param {*} records 
     * @param {*} successful 
     * @param {*} operation 
     * @param {*} node 
     */
    onTreeStoreLoad(store, records, successful, operation, node){
        //如果节点没有子节点，设置节点为叶子节点
        if(successful && records.length === 0){
            node.set('leaf',true);
            node.commit();
        }
    },

    /**
     * 绑定选择事件
     * @param {*} view 
     */
    bindSelectEvents(view){
        let me = this;
        view.on('select', me.onViewSelect, me);
        view.on('deselect', me.onViewDeselect, me);
    },

    /**
     * 选择节点
     * @param {} sender 
     * @param {*} select 
     * @param {*} eOpts 
     */
    //选择记录时执行的操作
    onViewSelect(sender,select, eOpts){
        this.setViewModelTreeSelectValue(Ext.isArray(select) ? select[0] : select);
        this.updateCrudButtonState();
    },

    /**
     * 取消节点选择的操作
     * @param {*} sender 
     * @param {*} records 
     * @param {*} eOpts 
     */
    onViewDeselect(sender,records, eOpts){
        //this.getViewModel().set('treeSelected', null);
    },

    /**
     * 刷新存储
     */
    onRefreshStore(){
        let me = this;
        let store = me.currentView.getStore();
        if(!store.isTreeStore){
            store.load();
            return;
        }
        let root = store.getRoot();
        if(!root.isExpanded()){
            root.expand();
            return;
        }
        let selection = me.getCurrentSelections()[0];
        store.load({node: selection? selection : root});
    },

    getSearchFieldValue(){
        let field = this.getView().down('field[isSearch]');
        return filed ? field.getValue() : null;
    },

    /**
     * 执行查询
     */
    doSearch(){
        let me = this,
            store = me.searchTreeStore,
            proxy = store.getProxy(),
            value = me.getSearchFieldValue(),
            params = proxy.extraParams;
        if(Ext.isEmpty(value)){
            if(Ext.isEmpty(params.query)) return;
            me.toggleView('tree');
            return;
        }
        params.query = value;
        store.load();
        me.toggleView('search');
    },

    /**
     * 切换视图
     * @param {视图名称} viewName 
     */
    toggleView(viewName){
        let me = this;
        me.listView.setHidden(viewName !== 'search');
        me.treeView.setHidden(viewName !== 'tree');
        me.currentView = viewName === 'tree' ? me.treeView : me.listView;
        if(viewName === 'tree') {
            //切换回树重新设置设置视图模型选择值
            me.setViewModelTreeSelectValue(this.treeView.getSelectable().getSelectedRecords()[0]);
            //根据树的选择更新按钮状态
            me.updateCrudButtonState();
        }
    },

    //设置视图模型treeSelect的值以切换子视图的值
    setViewModelTreeSelectValue(select){
        this.getViewModel().set('treeSelected',  select);
    },


    /**
     * 获取编辑窗口
     */
    currentEditView:{},
    getEditView(xtype){
        let me = this;
        xtype = xtype || 'treeeditview';
        let edit = me.currentEditView[xtype];
        if(!edit){
            edit = me.currentEditView[xtype] = DialogManager.getDialog(
                xtype,
                { defaultTitle: me.getEntityName()}
            );
        }
        if(!edit) Ext.raise('No view:' + xtype);
        return edit;
    },

    /**
     * 新建实体
     */
    onAddedEntity(){
        let me = this,  
            dlg = me.getEditView(),
            select = me.getCurrentSelections()[0];
        dlg.setDefaultModelValue({ parentId : select.getId(), parentName: select.get('displayName') });
        dlg.setSubmitUrl(me.getEntityName());
        dlg.callback = {fn: me.onEditViewHide ,scope: me}
        dlg.addRecord(true);
        dlg.show();
    },

    /**
     * 开始编辑前要执行的操作
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
            selection = me.getCurrentSelections()[0];
        if (!selection) {
            Ext.Msg.alert(I18N.DefaultMessageTitle, Ext.String.format(I18N.NoSelection, I18N[me.getEntityName()], I18N.Edit));
            return;
        }
        if(me.beforeEdited(selection)){
            if(Ext.isEmpty(selection.get('parentName'))){
                selection.set('parentName','无');
            }
            //dlg.setDefaultModelValue({ parentId : selection.getId(), parentName: selection.get('displayName') });
            dlg.setSubmitUrl(me.getEntityName());
            dlg.callback = {fn: me.onEditViewHide ,scope: me}
            dlg.setRecord(null);
            dlg.editRecord(selection,true);
            dlg.show();    
        }
    },

    /**
     * 检查更新
     * @param {*} id 
     * @param {*} name 
     */
    checkUpdate(id,name){
        let store = this.currentView.xtype === 'tree' ? this.searchTreeStore : this.treeStore;
        let record = store.getById(id);
        if(record && record.get('displayName') !== name) record.set('displayName', name);
    },

    /**
     * 新建或编辑实体后的回调函数，主要用于刷新存储
     * @param {*} form 
     * @param {*} isSavedSuccess 
     * @param {*} hasNewInSaved 
     */
    onEditViewHide(form, isSavedSuccess, hasNewInSaved){
        let me = this;
        if(me.currentView.xtype !== 'tree'){
            let [defaultValue, record] = [form.getDefaultModelValue(), form.getRecord()];
            me.checkUpdate(defaultValue.parentId, defaultValue.parentName);
            me.checkUpdate(record.getId(), record.get('displayName'));
            me.checkUpdate(record.get('parentId'), record.get('parentName'));    
        }
        if(hasNewInSaved && me.currentView.xtype === 'tree' ){
            let select = me.getCurrentSelections()[0];
            if(select.isLeaf()){
                select.set('leaf', false);
            }
            if(!select.isExpanded()){
                select.expand();
                return;
            }
            me.onRefreshStore();
        }
    },

    /**
     * 过滤不能删除的记录
     */
    filterByBeforeDeleted(){return true},

    /**
     * 删除操作
     */
    onDeletedEntity(){
        let me = this,
            store =- me.treeStore,
            entityName = me.getEntityName(),
            msgField = me.deleteMessageField,
            selections = me.getCurrentSelections(),
            url = URI.get(entityName, 'delete');
        if(store.isVirtualStore && me.isViewSelectAll){
            let proxy = store.getProxy();
            let params = Ext.clone(proxy.extraParams);
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

    /**
     * 
     * @param {删除成功} response 
     * @param {*} opts 
     */
    onDeletedSuccess(response, opts){
        let me = this,
            obj = Ext.decode(response.responseText, true),
            msg = '';
        me.getView().unmask();
        if (obj.success) {
            let select = me.getCurrentSelections()[0];
            if(me.currentView.xtype === 'tree'){
                //如果当前视图为树时，成功删除后，需要将删除节点的父节点作为选择节点
                let root = select.parentNode;
                me.treeView.getSelectable().select(root);
            }else{
                //如果当前视图为查询视图，成功删除后，
                // 如果在树中该节点已显示，需要删除该节点
                //如果要删除的节点为已选择节点，需要将它的父节点作为选择节点
                let store = me.treeStore,
                    selectable = me.treeView.getSelectable(),
                    treeSelect = selectable.getSelectedRecords()[0],
                    record = store.getById(select.getId());
                if(record) {
                    if(treeSelect.getId() === record.getId()){
                        me.treeView.suspendEvents();
                        selectable.select(treeSelect.parentNode);
                        me.treeView.resumeEvents();
                    }
                    store.remove(record);
                    store.commitChanges();
                };
            }
            me.onRefreshStore();
            msg = Ext.isArray(obj.result) ? obj.result.join('') : I18N.DeleteSuccess;
        }else{
            msg = obj.error.message;
        }
        Ext.toast(msg, null, 'bl');

    },


    /**
     * 执行删除操作
     * @param {} selections 
     * @param {*} url 
     * @param {*} msgField 
     * @param {*} entityName 
     * @param {*} success 
     */
    //执行删除操作
    doDelete(selections, url, msgField, entityName, success) {
        let me = this,
            fm = Ext.String.format,
            ids = [],
            contents= [];

        //如果没有要删除记录，显示提示
        if (selections.length === 0) {
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
                    me.getView().mask(I18N.DeleteWaitMsg);
                    Ext.Ajax.request({
                        method: 'DELETE',
                        url: url,
                        params: { id: ids },
                        success: success,
                        failure: me.onAjaxFailure,
                        scope: me
                    });
                }
            },
            me
        );
    },



})