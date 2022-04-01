Ext.define('Phone.view.home.HomeController', {
    extend: 'Common.view.home.HomeController',
    alias: 'controller.homeviewcontroller',

    dashboardXtype: 'phonedashboard',

    initView() {
        let me = this;
        me.getStore('menus').load();
    },

    setCurrentView(xtype) {
        let me = this,
            view = me.getView();

                
        if(xtype === me.dashboardXtype){
            let dashboard = view.add({xtype: me.dashboardXtype})
            view.setActiveItem(dashboard);
            return;
        }

        let store = me.getStore('menus');
        if(!store.isLoaded()){
            Ext.defer(me.setCurrentView, 50 , me , [xtype]);
            return;
        }

        let nodeIndex = store.find('viewType', xtype);

        if(nodeIndex === -1){
            me.show404Page();
            return;
        }



        let mainCard = me.getView(),
            cls = ViewMgr.getXtype(xtype);
        if(!cls){
            me.show404Page();
            return;
        }
        Ext.Viewport.setActiveItem(mainCard);
        ViewMgr.showView(xtype, ViewMgr.types.view,{}, false, mainCard);


    },



});