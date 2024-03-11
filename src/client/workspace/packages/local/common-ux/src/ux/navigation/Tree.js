Ext.define('Common.ux.navigation.Tree',{
    extend: 'Ext.list.Tree',
    xtype: 'uxnavigationtree',
    
    requires:[
        'Common.data.store.NavigationTrees'
    ],

    config:{
        currentViewType: null,
    },

    scrollable: 'y',
    ui: 'navigation',
    zIndex: 10,
    width: 250,
    singleExpand: true,
    expanderFirst: false,
    expanderOnly: false,
    
    store:{
        type: 'navigationtrees'
    },
    listeners: {
        selectionchange: 'onNavigationTreeSelectionChange',
    },


    isReady: false,

    onStoreLoaded(store, records, successful, operation, node, eOpts){
        this.isReady = true;
    },

    init(){
        let me = this,
            store = me.getStore(),
            root = store.getRoot();
        me.storeListeners = store.on('load', me.onStoreLoaded, me);
        store.setExtraParams('groupName', Ext.getApplication().getName().toLocaleLowerCase());
        root.getProxy().setExtraParam('groupName', Ext.getApplication().getName().toLocaleLowerCase());
        root.expand();
    },

    onLocalized(){
        let me = this,
            store = me.getStore(),
            records = store.byIdMap;
        me.callParent();
        Ext.iterate(records,(id, record)=>{
            record.set('text', me.getLocalizedText(record));
        });            
    },

    applyCurrentViewType(xtype){
        if(Ext.isEmpty(xtype)) return;
        let me = this,
            node = me.getNodeByXtype(xtype),
            parentNode = node ? node.parentNode : null;

        //如果未找到节点,直接返回
        if(!node) return;

        if (parentNode && !parentNode.isRoot() && !parentNode.isExpanded()){
            parentNode.expand();
        } 

        me.suspendEvent('selectionchange');
        me.setSelection(node);    
        me.resumeEvent ('selectionchange');
        // let parent = node.parentNode;
        // !parent.isExpanded() && parent.expand();
    },

    hasNode(xtype){
        let me = this,
            node = me.getNodeByXtype(xtype);
        if(node) me.setCurrentViewType(xtype);
        return !!node;
    },

    getNodeByXtype(xtype){
        let me = this,
            name = xtype.substring(xtype.indexOf('-')+1) || xtype,
            store = me.getStore();
        return store.findNode('router', name);

    },

    getItemConfig(node, parent) {
        let me = this;
        node.set('text', me.getLocalizedText(node));
        return Ext.apply({
            parentItem: parent.isRootListItem ? null : parent,
            owner: me,
            node: node,
            indent: me.getIndent()
        }, me.getDefaults());
    },

    doDestroy(){
        let me = this;
        Ext.destroy(me.storeListeners);
        me.setCurrentViewType(null);
        me.callParent();
    },

    privates:{
        getLocalizedText(record){
            if(!record || !record.getTranslation) return;
            return record.getTranslation(record, 'displayName') || record.get('displayName');
        }
    }

})