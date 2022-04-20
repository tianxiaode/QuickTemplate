Ext.define('Common.ux.crud.controller.Tree',{
    extend: 'Common.ux.crud.controller.Base',

    afterStoreChange(store){
        let me = this;
        Http.get(URI.crud(me.entityName, 'root'))
            .then(me.loadRootSuccess, me.onAjaxFailure, null, me);
    },

    loadRootSuccess(response){
        let me = this,
            root = Http.parseResponse(response),
            store = me.getStore();
        store.setRoot(Ext.clone(root));
        store.getRoot().expand();
    },

    /**
     * 刷新列表
     */
    onRefreshStore(){
        let me = this;
        if(!Enums.isReady) {
            Enums.on('ready', me.onRefreshStore, me, {single: true});
            return;
        };
        let store = me.list.getStore();

        let selection = me.getSelections()[0];
        //未有选择
        if(!selection){
            let root = store.getRoot();
            selection = root;
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
        console.log(node)
    },

    /**
     * 执行远程查询
     */
    doSearch(){
        let me = this,        
            values = me.getSearchValues()
            store = me.getStore(),
            proxy = store.getProxy(),
            params = proxy.extraParams,
            root = store.getRoot();
        if(!me.beforeSearch(values, params)) return;
        me.clearSearchValues(params);
        Ext.apply(params,values);
        root.removeAll();
        if(!values.filter){
            store.setAsynchronousLoad(true);
            me.onRefreshTreeNode(store , root);
            return;
        }
        store.setAsynchronousLoad(false);
        Http.get(URI.crud(me.entityName),values).then(me.onLoadSearchDataSuccess, me.onAjaxFailure, null, me);
    },

    onLoadSearchDataSuccess(response){
        let me = this,
            store = me.getStore(),
            root = store.getRoot(),
            data = Http.parseResponse(response).items;
        if(data.length === 0) return;
        Ext.iterate(data, d=>{
            let children = d.children;
            d.children = null;
            let append = root.appendChild(d,true);
            me.appendChild(append, children);
        })
    },

    appendChild(node, appends){
        if(!appends) return;        
        Ext.iterate(appends,d=>{
            let children = d.children;
            d.children = null;
            let append = node.appendChild(d,true);
            this.appendChild(append, children);
        })
        node.expand();
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
            searchCode = code.replace(nodeCode,'').substr(1,7);
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
            selections = me.getSelections(),
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
    },

    

})