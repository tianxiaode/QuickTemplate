Ext.define('Desktop.view.dashboard.Dashboard',{
    extend: 'Ext.Panel',
    xtype: 'dashboard',

    requires:[
        'Common.ux.form.Base'
    ],

    userCls: 'bg-content',
    layout: 'vbox',

    items:[
        {
            xtype: 'uxformpanel',
            flex: 1,
            items: [
                { name: 'a'},
                { name: 'b', readOnly: true},
                { name: 'c' },
                { name: 'd', disabled: true},
                { name: 'e'},
                { name: 'f'},
                { name: 'g'},
                { name: 'h'},
                { name: 'i'},
                { name: 'j'},

            ]
        }        
    ]


});