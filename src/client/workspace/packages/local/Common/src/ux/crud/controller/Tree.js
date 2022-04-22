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

    allowUpdate(hasSelected){
        if(!hasSelected) return false;
        let me = this,
            selection = me.getSelections()[0]
        return !selection.isRoot();
    },

    allowDelete(hasSelected){
        return this.allowUpdate(hasSelected);
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
        let store = me.list.getStore(),
            isAsync = store.getAsynchronousLoad();
        
        if(!isAsync){
            me.doSearch();
            return;
        }

        let selection = me.getSelections()[0];
        //没有选择
        if(!selection){
            selection = store.getRoot();
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
        node.data && (node.data.depth < 4) && node.expand();
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
            parent = me.currentParent,
            isExpanded = parent.isExpanded(),
            isAsync = me.getStore().getAsynchronousLoad();
        if(isAsync && !isExpanded){
            me.currentParent.set('leaf',false);
            me.onRefreshTreeNode(me.getStore(), me.currentParent);
            return;    
        }
        parent.appendChild(Ext.clone(record.data));
        !isAsync && !isExpanded && parent.expand();
    },

    onChildNodeExpand(code, node){
        this.searchTreeNode(code, node);
    },

    getParentNode(record){
        let me = this,
            store = me.getStore(),
            selection;
        console.log('getParentNode', record)
        if(record){
            selection = store.getById(record.get('parentId'));
            if(selection) return selection;
        }
        selection = me.getSelections()[0];
        console.log('getParentNode', selection)
        if(selection) return selection;
        return store.getRoot();

    },

    getDefaultModelValue(record){
        let me = this,
            parent = me.getParentNode(record);
        me.currentParent = parent;
        return { parentId : parent.getId(), parentName: parent.get('displayName') };
    },

})