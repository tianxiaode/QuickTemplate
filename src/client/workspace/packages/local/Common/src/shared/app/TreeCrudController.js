Ext.define('Common.app.TreeCrudController',{
    extend: 'Common.app.CrudController',

    searchList: null, //搜索列表

    initList(me){
        me.callParent(arguments);
        me.initSearchList(me);
    },

    /**
     * 获取查询时的对象
     */
    initSearchList(me){
        let view = me.getView(),
            searchList = view.down('#searchList');
        if(!searchList) return;
        searchList.on('storechange', me.onSearchStoreChange ,me);
        me.searchList = searchList;
    },

    /**
     * 列表组件的存储发生改变是执行的操作
     * @param {列表组件} sender 
     * @param {存储} store 
     * @param {旧存储} oldStore 
     * @param {配置参数} eOpts 
     */
     onStoreChange(sender, store, oldStore, eOpts){
        let me = this;
        me.setRoot(store);
        me.callParent(arguments)
    },

    setRoot(store){
        Ext.raise('没有定义setRoot方法');
    },
    
    /**
     * 存储加载后的处理
     * @param {存储} store 
     * @param {记录} records 
     * @param {是否成功} successful 
     * @param {操作} operation 
     * @param {操作参数} eOpts 
     */
    onStoreLoad(store, records, successful, operation, eOpts){
        let me = this;
        if(!successful) return;
        //数据加载后，选择第一个记录
        let selection = me.getCurrentSelections();
        //如果当前列表是树，且已存在选择，直接返回
        if(selection.length>0) return;
        let record = store.getAt(0);
        if(record) me.list.getSelectable().select(record);
    },

    /**
     * 当存在查询列表时，执行事件绑定
     * @param {列表组件} sender 
     * @param {存储} store 
     */
    onSearchStoreChange(sender, store){
        let me = this,
            list = this.searchList;
        if(!list) return;
        store.on('beforeload', me.onSearchStoreBeforeLoad, me);
        store.on('load', me.onSearchStoreLoad, me)
        list.on('select', me.onViewSelect, me);
        list.on('deselect', me.onViewDeselect, me);
    },
  
    /**
     * 查询存储加载前的操作
     */
    onSearchStoreBeforeLoad(){},

    /**
     * 查询存储数据加载后的操作
     * @param {存储} store 
     * @param {记录} records 
     * @param {是否成功} successful 
     * @param {操作} operation 
     * @param {操作参数} eOpts 
     */
    onSearchStoreLoad(store, records, successful, operation, eOpts){
        if(!successful || records.length === 0) return;
        let record = store.getAt(0);
        if(record) this.searchList.getSelectable().select(record);
    },


    /**
     * 选择记录
     * @param {事件触发者} sender 
     * @param {选择的记录} selected 
     * @param {事件选项} eOpts 
     */    
    onViewSelect(sender, selected, eOpts ){
        let me = this,
            selections = me.getCurrentSelections();
        me.callParent(arguments);        
        me.setViewModelValue('masterSelected', selections[0]);
    },

    /**
     * 取消记录的选择     * 
     * @param {事件触发者} sender 
     * @param {选择的记录} records 
     * @param {事件选项} eOpts 
     */
    onViewDeselect(sender, records, eOpts){
        let me = this;
        me.callParent(arguments);
        me.setViewModelValue('masterSelected', null);
    },

    /**
     * 取消全部选择
     */
    doDeselectAll(){},

    /**
     * 刷新列表
     */
    onRefreshStore(){
        let me = this;
        if(!Enums.isReady) {
            Enums.on('ready', me.onRefreshStore, me, {single: true});
            return;
        };
        let store = me.currentList.getStore();
        if(!store.isTreeStore){
            store.loadPage(1);
            return;

        }
        let selection = me.getCurrentSelections()[0];
        //未有选择
        if(!selection){
            let root = store.getRoot();
            selection = root;
            me.currentList.getSelectable().select(root);
        }
        me.onRefreshTreeNode(store, selection);
    },

    /**
     * 刷新树节点
     * @param {存储} store 
     * @param {节点} node 
     */
    onRefreshTreeNode(store ,node){
        //如果节点是不可展开的，获取父节点
        if(!node.isExpandable()){
            node = node.parentNode;
        }
        //已展开
        if(node.isExpanded()){
            //, selection : store.getRoot()
            store.load({node: node})
            return;
        }
        node.expand();
    },

    /**
     * 根据查询值切换视图
     * @param {是否存在查询值} isSearch 
     */
    switchList(isSearch){
        let me = this;
        me.currentList = isSearch ? me.searchList : me.list;
        let selections = me.getCurrentSelections(),
            selection = selections[0];
        if(!selection){
            selection =me.currentList.getStore().getAt(0);
            if(selection) me.currentList.getSelectable().select(selection);
        }
        me.setViewModelValue('masterSelected', selection);
        //如果存在基本树视图，切换视图
        let cardContainer = me.list.up();
        if(cardContainer.getLayout().type === 'card') cardContainer.setActiveItem(me.currentList);
    },

    /**
     * 执行远程查询
     */
     doSearch(){
        let me = this,        
            values = me.getSearchValues();
        me.switchList(!Ext.isEmpty(values.query));
        let store = me.currentList.getStore();
        let proxy = store.getProxy(),
            params = proxy.extraParams;
        if(!me.beforeSearch(values, params)) return;
        me.clearSearchValues(params);
        Ext.apply(params,values);
        store.loadPage(1);
    },

    /**
     * 新增记录后操作
     * @param {编辑视图}} sender 
     * @param {后续操作} action 
     * @param {新增的记录} record 
     */
    onCreateOrUpdateViewSaved(sender, action, after , record){
        //如果后续操作是新增，不进行任何操作
        if(action === 'update' ) return;
        let me = this,
            store = me.list.getStore(),
            node = store.getById(record.get('parentId'));
        //父节点不存在，直接返回
        if(!node) return;
        //当前列表不是查询列表      
        if(me.currentList.getStore().isTreeStore){                
            if(node.isLeaf()){
                //如果父节点是子节点
                node.set('leaf', false);
            }
            me.onRefreshTreeNode(store, node);
            return;
        }
        //当前为查询视图
        //获取树节点
        let treeNode = store.getById(node.getId());
        //树节点已显示
        if(treeNode){
            me.onRefreshTreeNode(store, treeNode);
            return;
        }
        //树节点未显示
        let code = node.get('code'),
            root = store.getRoot();
       me.searchTreeNode(code, root);        
    },

    /**
     * 根据code查询新增节点的父节点
     * @param {要查询的code}} searchCode 
     * @param {当前节点} node 
     * @param {查询深度}} index 
     */
    searchTreeNode(code, node){
        let me = this,
            nodeCode = node.get('code'),
            searchCode = code.replace(nodeCode,'').substr(1,5);
        if(Ext.isEmpty(searchCode)) return;
        let child = node.findChild('code', `${nodeCode}.${searchCode}`);
        //子节点存在，继续查询
        if(child) {
            if(child.isLeaf()){
                node.set('leaf', false);
            }
            //未展开
            if(!child.isExpanded()){
                child.on('expand', me.onChildNodeExpand, me, {single: true, args:[code]});
                child.expand();
                return;
            }
            me.searchTreeNode(code, child);
        };

    },

    onChildNodeExpand(code, node){
        this.searchTreeNode(code, node);
    },

    getDefaultModelValue(isEdit){
        let me = this,
            selections = me.getCurrentSelections(),
            record = selections[0],
            parentId = record.getId(),
            parentName = record.get('displayName');
        if(isEdit){
            parentId = record.get('parentId');
            parentName = record.get('parentName');
            if(Ext.isEmpty(parentId)){
                let root = me.list.getStore().getRoot();
                parentId = root.getId();
                parentName = root.get('displayName');
                record.set('parentId', parentId);
                record.set('parentName', parentName);
                record.commit();
            } 
        }
        return { parentId : parentId, parentName: parentName };
    }


})