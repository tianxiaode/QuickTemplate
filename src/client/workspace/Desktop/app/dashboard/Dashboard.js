Ext.define('Desktop.view.dashboard.Dashboard',{
    extend: 'Ext.Panel',
    xtype: 'dashboardview',

    layout: {
        type: 'auto',
    },


    userCls: 'flex-wrap-item',

    defaults:{
        width: '49%',
        autoLabel: false
    },

    items:[
        { xtype: 'textfield', langLabel: '1'},
        { xtype: 'textfield', label: '2'},
        { xtype: 'textfield', label: '3'},
        { xtype: 'textfield',  label: '4'},
        { xtype: 'textfield',  label: '5'},
        { xtype: 'textfield',  label: '6'},
        { xtype: 'textfield',  label: '7'},
        { xtype: 'textareafield', width: '100%', label: '8'},
    ]


});