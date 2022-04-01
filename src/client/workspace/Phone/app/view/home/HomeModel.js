Ext.define('Phone.view.home.HomeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.homeviewmodel',

    requires:[
        'Common.data.store.PhoneMenus'
    ],

    data:{
        unreadBadgeText: '',
        isAuthenticated: false,
    },

    stores:{
        menus:{
            type: 'phonemenus',
        }
    }

});