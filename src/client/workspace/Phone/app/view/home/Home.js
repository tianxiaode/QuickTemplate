Ext.define('Phone.view.home.Home', {
    extend: 'Ext.Container',
    xtype : 'homeview', 

    requires:[
        'Ext.grid.cell.Check',
        'Phone.view.dashboard.Dashboard',
        'Phone.view.home.HomeController',
        'Phone.view.home.HomeModel',
        'Phone.view.identity.roles.Role',
        'Phone.view.identity.users.User',
    ],
    
    shadow: false,
    layout: 'card',

    controller: 'homeviewcontroller',
    viewModel: 'homeviewmodel',

});