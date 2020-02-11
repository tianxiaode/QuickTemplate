Ext.define('Common.Desktop.view.base.tree.TreeController',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.baseTree',

    deleteMessageField: 'displayName',

    init:function(){
        let me = this;
        let view = me.getView();
        let listView = me.listView = view.down('list');
        let treeView = me.treeView = view.down('tree');
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

    onListViewRenderItem(value){
        let store = this.searchTreeStore;
        let query = store.getProxy().extraParams.query;
        return value.replace(new RegExp(query,'ig'), '<span style="color:red;">' + query +'</span>');
    },

    //获取实体名称
    getEntityName: function(){
        return this.getView().getEntityName();
    },

    //获取当前选择
    getCurrentSelections: function(){
        let me = this;
        let view = me.currentView;
        return view.getSelectable().getSelectedRecords();
    },

    //获取按钮
    getButton: function(itemId){
        return this.getView().down('#' + itemId);
    },


    //设置按钮禁用状态
    setButtonDisabled: function(itemId,disabled){
        let button = this.getButton(itemId);
        if(button) button.setDisabled(disabled);
    },

    //设置按钮显示状态
    setButtonHidden: function(itemId,hidden){
        let button = this.getButton(itemId);
        if(button) button.setHidden(hidden);
    },

    //初始化CRUD按钮的显示
    initCrudButtonHiddenState:function(){
        let me = this
        let [view, entityName] = [me.getView() ,me.getEntityName()];
        me.setButtonHidden('create', !ACL.isGranted('Pages.'+ entityName + '.Create') || !view.getUseCreateButton());
        me.setButtonHidden('edit', !ACL.isGranted('Pages.'+ entityName + '.Edit') || !view.getUseEditButton());
        me.setButtonHidden('delete', !ACL.isGranted('Pages.'+ entityName + '.Delete') || !view.getUseDeleteButton());
    },

    editButtonStateValidation: function(selections){
        if(selections.length <= 0) return true;
        if(this.currentView.xtype === 'tree'){
            let select = selections[0];
            if(select.getId() <=0) return true;
        }
        return false;
    },

    deleteButtonStateValidation(selections){
        if(selections.length <= 0) return true;
        if(this.currentView.xtype === 'tree'){
            let select = selections[0];
            if(select.getId() <=0) return true;
            if(!select.isLeaf()) return true;    
        }
        return false;
    },


    //附加编辑按钮状态验证
    additionalEditButtonStateValidation: function(){return false},
    //附加删除按钮状态验证
    additionalDeleteButtonStateValidation: function(){return false},
    /**
     * 更新CRUD按钮状态
     */
    updateCrudButtonState:function(){
        let me = this;
        let selections = me.getCurrentSelections();
        me.setButtonDisabled('edit',  me.additionalEditButtonStateValidation(selections) || me.editButtonStateValidation(selections));
        me.setButtonDisabled('delete',me.additionalDeleteButtonStateValidation(selections) || me.deleteButtonStateValidation(selections));
    },

    //绑定搜索store时，绑定选择事件
    onSearchTreeStoreChange(sender, store, oldStore, eOpts){
        let me = this;
        me.searchTreeStore = store;
        store.on('beforeload', me.onSearchTreeStoreBeforeLoad,me);
        store.on('load', me.onSearchTreeStoreLoad,me);
        store.getProxy().setUrl(URI.get(me.getEntityName(),'getAllQuery'));
        me.bindSelectEvents(sender);
        //me.onRefreshStore();
    },

    //搜索store加载前取消所有选择
    onSearchTreeStoreBeforeLoad(){
        this.listView.getSelectable().deselectAll();
    },

    //搜索store加载后选择默认记录
    onSearchTreeStoreLoad(store, records, successful, operation, eOpts ){
        if(records.length>0){
            let record = records[0]
            this.listView.getSelectable().select(record);
        }
    },

    initRoot(store){
        let root = store.getRoot();
        root.set('displayName',I18N.All + I18N[this.getEntityName()]);
        root.commit();
        return root;
    },

    //绑定treestore时，绑定选择事件
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

    //树store加载后选择第一个记录
    onTreeStoreLoad(store, records, successful, operation, node){
        // let view = this.treeView;
        // let selectable = view.getSelectable();
        // let selects = selectable.getSelectedRecords();
        if(records.length === 0){
            node.set('leaf',true);
            node.commit();
        }
    },

    //绑定store的select事件
    bindSelectEvents(view){
        let me = this;
        view.on('select', me.onViewSelect, me);
        view.on('deselect', me.onViewDeselect, me);
    },

    //选择记录时执行的操作
    onViewSelect(sender,select, eOpts){
        this.setViewModelTreeSelectValue(Ext.isArray(select) ? select[0] : select);
        this.updateCrudButtonState();
    },

    //取消记录选择时执行的操作
    onViewDeselect(sender,records, eOpts){
        //this.getViewModel().set('treeSelected', null);
    },

    //刷新store
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

    //执行查询
    doSearch(){
        let me = this;
        let [view, store] = [me.getView(), me.searchTreeStore];
        let [proxy,value] = [store.getProxy(), view.down('#query').getValue()];
        let params = proxy.extraParams;
        if(Ext.isEmpty(value)){
            if(Ext.isEmpty(params.query)) return;
            me.toggleView('tree');
            return;
        }
        params.query = value;
        store.load();
        me.toggleView('search');
    },

    //切换视图
    toggleView(viewName){
        let me = this;
        me.listView.setHidden(viewName !== 'search');
        me.treeView.setHidden(viewName !== 'tree');
        me.currentView = viewName === 'tree' ? me.treeView : me.listView;
        if(viewName === 'tree') {
            //切换回树重新设置设置视图模型选择值，以刷新产品
            me.setViewModelTreeSelectValue(this.treeView.getSelectable().getSelectedRecords()[0]);
            //根据树的选择更新按钮状态
            me.updateCrudButtonState();
        }
    },

    //设置视图模型treeSelect的值以切换子视图的值
    setViewModelTreeSelectValue(select){
        this.getViewModel().set('treeSelected',  select);
    },

    /**********************开始：增删改操作**************************************/

    /**
     * 获取编辑窗口，如果窗口不存在，调用Common.Shared.util.Config的getDialog创建窗口
     */
    currentEditView:{},
    getEditView: function(xtype,callback){
        let me = this;
        xtype = xtype || 'treeEditView';
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

    //新建实体
    onAddedEntity: function(){
        let me = this,  
            dlg = me.getEditView(),
            select = me.getCurrentSelections()[0];
        dlg.setDefaultModelValue({ parentId : select.getId(), parentName: select.get('displayName') });
        dlg.setSubmitUrl(me.getEntityName());
        dlg.callback = {fn: me.onEditViewHide ,scope: me}
        dlg.addRecord(true);
        dlg.show();
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

    checkUpdate(id,name){
        let store = this.currentView.xtype === 'tree' ? this.searchTreeStore : this.treeStore;
        let record = store.getById(id);
        if(record && record.get('displayName') !== name) record.set('displayName', name);
    },

    //新建或编辑实体后的回调函数，主要用于刷新存储
    onEditViewHide: function(form, isSavedSuccess, hasNewInSaved){
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

    // 用户过滤不能删除的记录
    filterByBeforeDeleted: function(){return true},

    //开始删除操作
    onDeletedEntity: function(){
        let me = this;
        let [store, entityName, msgField,selections] = [me.treeStore, me.getEntityName(), me.deleteMessageField, me.getCurrentSelections()];
        let url = URI.get(entityName, 'delete');
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

    //删除操作的回调函数
    onDeletedSuccess: function(response, opts){
        let [me,obj, msg] = [this, Ext.decode(response.responseText), ''];
        Ext.Viewport.unmask();
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
                let store = me.treeStore;
                let selectable = me.treeView.getSelectable();
                let treeSelect = selectable.getSelectedRecords()[0];
                let record = store.getById(select.getId());
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
        '<li class="pointthree">{.}</li>',
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


})