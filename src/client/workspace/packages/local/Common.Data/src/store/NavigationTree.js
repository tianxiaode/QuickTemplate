Ext.define('Common.Data.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'NavigationTree',

    fields: [{
        name: 'text'
    }],

    root: {
        expanded: true,
        children: [
            {
                text: 'pageblank',
                viewType: 'pageblank',
                leaf: true,
                visible: false
            },
            {
                text: 'page500',
                viewType: 'page500',
                leaf: true,
                visible: false
            },
            {
                text: 'page404',
                viewType: 'page404',
                leaf: true,
                visible: false
            },
            {
                text: 'login',
                viewType: 'login',
                leaf: true,
                visible: false
            },
            {
                text: 'passwordreset',
                viewType: 'passwordreset',
                leaf: true,
                visible: false
            },
            {
                text: I18N.Dashboard,
                viewType: 'admindashboard',
                iconCls: 'x-fa fa-home',
                leaf: true
            },
            {
                text: I18N.EChart,
                viewType: 'echartview',
                iconCls: 'x-fa fa-chart-line',
                leaf: true
            }
        ]
    }
});
