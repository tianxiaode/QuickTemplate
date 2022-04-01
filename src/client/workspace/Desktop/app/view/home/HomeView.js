Ext.define('Desktop.view.home.HomeView', {
	extend: 'Ext.Container',
	xtype: 'homeview',

    requires: [
        'Ext.layout.Card',
        'Ext.dataview.List',
        'Ext.list.Tree',
        'Ext.Button',
        'Ext.SplitButton',
        'Ext.layout.HBox',
        'Ext.layout.VBox',
        'Ext.field.Container',
        'Ext.Spacer',
        'Common.ux.navigation.Tree',
        'Desktop.view.home.HeaderBar',
        'Desktop.view.home.HomeViewController',
        'Desktop.view.home.HomeViewModel',
        'Desktop.view.dashboard.Dashboard',
        'Desktop.view.identity.roles.Role',
    ],

    controller: 'homeview',
    viewModel: 'homeview',

    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },


    items: [
        {
            xtype: 'desktop-headerbar',
        },
        {
            xtype: 'container',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch',

                // Tell the layout to animate the x/width of the child items.
                animate: true,
                animatePolicy: {
                    x: true,
                    width: true
                }
            },
            items: [
                {
                    xtype: 'uxnavigationtree',
                    reference: 'navigationTree',
                },
                {
                    xtype: 'container',
                    flex: 1,
                    reference: 'mainCardPanel',
                    cls: 'sencha-dash-right-main-container p-2 bg-grey-200',
                    itemId: 'contentPanel',
                    layout: 'card',                    
                    //style: 'background-color:#f5f5f5;',
                    
                }
            ]
        }
    ],

});
