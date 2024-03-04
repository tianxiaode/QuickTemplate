Ext.define('Desktop.view.dashboard.Dashboard',{
    extend: 'Ext.Panel',
    xtype: 'dashboard',

    requires:[
        'Common.ux.dialog.Form'
    ],

    userCls: 'bg-content',
    layout: 'vbox',

    items:[
        // {
        //     xtype: 'uxactiontoolbar',
        //     toolbar:{
        //         items:[
        //             {
        //                 xtype: 'button',
        //                 iconCls: 'x-fa fa-file'
        //             },
        //             {
        //                 xtype: 'button',
        //                 iconCls: 'x-fa fa-redo'
        //             }
        //         ]    
        //     }
        // },
        // {
        //     xtype: 'button',
        //     langText: 'save',
        //     flex: 1,
        //     handler:()=>{
        //         let dlg = Ext.create('Common.ux.dialog.Form');
        //         dlg.show();
        //     }
        // }        
    ]


});