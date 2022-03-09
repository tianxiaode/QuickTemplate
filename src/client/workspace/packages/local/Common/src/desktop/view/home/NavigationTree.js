Ext.define('Common.desktop.view.home.NavigationTree',{
    extend: 'Ext.list.Tree',
    xtype: 'commondesktop-navigationtree',
    
    requires:[
        'Common.data.store.NavigationTrees',
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
        selectionchange: 'onNavigationTreeSelectionChange'
    },

    onLocalized(){
        let me = this,
            store = me.getStore(),
            records = store.byIdMap;
        Object.keys(records).forEach(id=>{
            if(id<10000) return;
            let record = records[id];
            record.set('text', I18N.get(record.get('langText')));
        })
    },

    isReady: false,
    init(){
        let me = this;
        me.loadData().then(me.loadDataSuccess, Ext.bind(Failure.ajax,me,[null, true],true), null,me);
    },

    loadData(){
        return Http.get(URI.get('menus', 'desktop'));
    },

    loadDataSuccess(response){
        let me = this;
        if(!I18N.isReady){
            Ext.defer(me.loadDataSuccess, 50, me, [response]);
            return;
        }
        let data = Http.parseResponseText(response),
            store = me.getStore(),
            root = store.getRoot();
        root.removeAll();
        root.appendChild([].concat(data.result));
        me.isReady = true;
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
    },

    hasNode(xtype){
        let me = this,
            node = me.getNodeByXtype(xtype);
        if(node) me.setCurrentViewType(xtype);
        return !!node;
    },

    getNodeByXtype(xtype){
        let me = this,
            name = xtype.substring(xtype.indexOf('-')+1),
            store = me.getStore();
        return store.findNode('viewType', name);

    }


})