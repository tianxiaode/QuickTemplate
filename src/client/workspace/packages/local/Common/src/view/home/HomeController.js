Ext.define('Common.view.home.HomeController',{
    extend: 'Ext.app.ViewController',

    currentToken: null,

    routes: {
        ':xtype': {
            before : 'onBeforeRoute',
            action: 'handleRoute',
        },
        ':xtype/:id':{
            before : 'onBeforeRoute',
            action: 'onShowDialog'
        }

    },

    onBeforeRoute(hash, action){
        console.log('onBeforeRoute', hash, action)
        let me = this;
        if(!Auth.isAuthenticated()){
            action.stop();
            Auth.on('loggedin', me.loadConfiguration, me);
            Auth.login(hash);
            return;
        }

        if(!me.isReady()){
            action.stop();
            me.loadConfiguration();
            return;
        }

        action.resume();
    },


    isLoadConfiguration: false,
    

    handleRoute(xtype){
        console.log('handleRoute', xtype);
        let me = this,
            view = me.getView();
        if(!ViewMgr.pages.hasOwnProperty(xtype)) {
            me.onHideLastView();
            me.currentToken = xtype;
        }

        view.setMasked(false);

        if(Ext.isEmpty(xtype)){
            ViewMgr.showPage(ViewMgr.pages.page404);
            return;
        }

        //如果是显示首页，调整到默认页
        if(xtype.toLowerCase() === ViewMgr.homeViewXtype){
            let defaultToke = me.getDefaultToken();
            Ext.History.add(defaultToke, true);
            me.handleRoute(defaultToke);
            return;
        }

        Ext.Viewport.setActiveItem(view);
        me.setCurrentView(xtype);
    },


    loadConfiguration() {
        let me = this,
            vm = me.getViewModel();
        vm.set('isAuthenticated', true);

        me.getView().setMasked(I18N.getLocalText('LoadingUserConfiguration'));
        Config.on('ready', me.checkConfigLoaded, me);
        I18N.on('ready', me.checkConfigLoaded, me);
        Enums.on('ready', me.checkConfigLoaded, me);    
        Ext.defer(()=>{
            Config.loadConfiguration();
            I18N.loadResources();
            Enums.init();    
        },10)
        //Signalr.connect();

    },

    checkConfigLoaded(){
        console.log('checkConfigLoaded', arguments)
        let me = this,
            hash = Auth.getOrginHash() || Ext.util.History.getToken() || me.getDefaultToken();
        if(!me.isReady()) return;
        Auth.removeOrginHash();
        me.redirectTo(hash, { force: true, replace: true });
    },

    isReady(){
        console.log(Config.isReady , I18N.isReady , Enums.isReady)
        return Config.isReady && I18N.isReady && Enums.isReady;
    },


    initView: Ext.emptyFn,

    setCurrentView: Ext.emptyFn,

    getDefaultToken(){
        return Ext.getApplication().getDefaultToken();
    },

    show404Page(){
        ViewMgr.showPage(ViewMgr.pages.page404);
    },



    onShowDialog(xtype, op){
        let me = this,
            params = ViewMgr.getParams(xtype),
            container = Ext.platformTags.phone ? me.getView() : null;
        if(Ext.Object.isEmpty(params)) {
            Ext.History.back();
            return;
        }
        me.currentToken = Ext.History.getToken();
        let view = ViewMgr.showView(xtype,params.type, params.config, true, container);
        if(op === 'more' && params.record) {
            view.setRecord(params.record);
        };
    },

    onHideLastView(){
        let me = this,
            token = me.currentToken;
        if(Ext.isEmpty(token)) return;
        let index = token.indexOf('/');
        if(index<0) return;
        let xtype = token.substring(token, index),
            params = ViewMgr.getParams(xtype),
            view = ViewMgr.getView(xtype, params.type);
        if(view) view.setHidden(true);
    },

    onShowPages(){
        let xtype = Ext.History.getToken();
        ViewMgr.showPage(xtype);
    },

    doDestroy(){
        let me = this;
    }
})