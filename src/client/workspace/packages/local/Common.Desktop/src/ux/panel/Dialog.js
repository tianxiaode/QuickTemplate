/**
 * 自定义对话框
 * 框架默认的对话框在多次操作后，会因为动画问题出现不能关闭窗口bug，这个对话框省略了动画部分
 */
Ext.define('Common.Desktop.ux.panel.Dialog', {
    extend: 'Ext.Panel',
    xtype: 'uxdialog',

    mixins:[
        'Common.Desktop.mixin.panel.Dialog',
    ]

});