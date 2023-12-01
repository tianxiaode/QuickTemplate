Ext.define('Common.view.home.HomeModel',{
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.homemodel',


    data: {
        currentView: null,
        userName: null,
        appTitle: '',
        unreadBadgeText: '',
        isAuthenticated: false
    }


})