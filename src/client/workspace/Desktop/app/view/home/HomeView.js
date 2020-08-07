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
        'Common.desktop.view.home.NavigationTree',
        'Desktop.view.home.HomeViewController',
        'Desktop.view.home.HomeViewModel',
        'Desktop.view.dashboard.Dashboard',
        'Desktop.view.echarts.Echart',
    ],

    controller: 'homeview',
    viewModel: 'homeview',

    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners:{
        painted: 'onHomeViewPainted'
    },

    items: [
        {
            xtype: 'toolbar',
            padding: '0 0 0 0',
            height: 64,
            reference: 'HeaderBar',
            itemId: 'headerBar',
            items: [
                // {
                //     xtype: 'component',
                //     reference: 'SenchaLogo',
                //     cls: 'sencha-logo',                    
                //     html:`
                //         <span class="logo-img" style="background-image: url(${URI.getResource('logo')});"></span>
                //         <span  class="company-name" style="font-size:24px;line-height:65px">${I18N.Company}</span>
                //     `,
                //     width: 250
                // },
                {
                    xtype: 'component',
                    reference: 'senchaLogo',
                    cls: 'sencha-logo',
                    html: `<div class="main-logo"><img src="${URI.getResource('logo')}"></div>`,
                    width: 250
                },
                {
                    xtype: 'spacer',width: 5
                },
                {
                    ui: 'header',
                    iconCls: 'x-fa fa-bars',
                    id: 'main-navigation-btn',
                    handler: 'onToggleNavigationSize'
                },
                {
                    xtype: 'spacer',width: 5
                },
                { xtype: 'title', bind: {html:  '{appTitle}'}, style: 'font-size:24px;line-height:32px;color:#424242;margin-top:-5px;' },
                '->',
                {
                    xtype: 'languagebutton',
                    ui: 'header',
                },
                {
                    ui: 'header',
                    iconCls: 'x-fa fa-sign-out-alt',
                    handler: 'onLogout',
                    langTooltip: 'Login'
                },
                {
                    xtype: 'spacer',width: 5
                },
                {
                    xtype: 'button',                    
                    reference: 'UserNameComponent',
                    ui: 'header',
                    bind: { html: '{userName}' },
                    //arrow: false,
                    //menuAlign: 'br',
                    // menu:{
                    //     xtype: 'usermenu'
                    // }
                }
            ]
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
                    xtype: 'commondesktop-navigationtree',
                    reference: 'navigationTreeList',
                    itemId: 'navigationTreeList',
                },
                {
                    xtype: 'container',
                    flex: 1,
                    reference: 'mainCardPanel',
                    cls: 'sencha-dash-right-main-container',
                    itemId: 'contentPanel',
                    layout: 'card',                    
                    style: 'background-color:#f5f5f5;padding:20px;',
                    
                }
            ]
        }
    ],

});
