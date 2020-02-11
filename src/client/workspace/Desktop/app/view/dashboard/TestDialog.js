Ext.define('Desktop.view.dashboard.TestDialog',{
    extend: 'Common.Desktop.ux.panel.Dialog',
    xtype: 'testdialog',

    title: 'Test dialog',
    items:[
        { xtype: 'component' , html: 'test'}
    ]
})