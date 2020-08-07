Ext.define('Common.desktop.view.home.NavigationTree',{
    extend: 'Ext.list.Tree',
    xtype: 'commondesktop-navigationtree',
    
    requires:[
        'Common.data.store.NavigationTrees',
        'Common.shared.util.Url',
        'Common.shared.util.Failure'
    ],

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

    isReady: false,
    initialize(){
        const me = this;
        me.loadData().then(me.loadDataSuccess, Failure.ajax, null,me);
    },

    loadData(){
        return Ajax({
            //url: URI.get('Configuration', 'menus'),
            url: URI.getResource('nav'),
            scope: this
        })
    },

    loadDataSuccess(response){
        const me = this,
            obj = Ext.decode(response.responseText, true);
        if(!Ext.isArray(obj)){
            Failure.ajax.apply(me, [response]);
            return;
        }
        const store = me.getStore(),
            root = store.getRoot();
        root.appendChild([].concat(obj));
        me.isReady = true;
        me.fireEvent('ready', me);
    }

})