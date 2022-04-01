Ext.define('Phone.view.dashboard.DashboardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.phone-dashboardcontroller',

    onMenuItemTap(sender,location,eOpts){
        let record = location.record;
        if(record){
            this.redirectTo(record.get('viewType'));
        }
    },

});