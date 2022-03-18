Ext.define('Common.ux.navigation.Tree',{
    extend: 'Ext.list.Tree',
    xtype: 'uxnavigationtree',
    
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

    initialize(){
        let me = this;
        me.callParent();
        Auth.isAuthenticated() &&  Http.get(URI.get('configuration','menus/desktop')).then(me.loadDataSuccess, me.loadDataFailure, null, me)
    },


    isReady: false,

    loadDataSuccess(response){
        let me = this;
        let data = Http.parseResponse(response),
            store = me.getStore(),
            root = store.getRoot();
        root.removeAll();
        root.appendChild([].concat(data.items));
        me.onLocalized();
        me.isReady = true;
    },

    onLocalized(){
        let me = this,
            store = me.getStore(),
            records = store.byIdMap;
        me.callParent();
        Ext.iterate(records,(id, record)=>{
            record.set('text', I18N.get(record.get('langText')));
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