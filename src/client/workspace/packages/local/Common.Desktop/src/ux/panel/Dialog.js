/**
 * 自定义对话框
 * 框架默认的对话框在多次操作后，会因为动画问题出现不能关闭窗口bug，这个对话框省略了动画部分
 */
Ext.define('Common.Desktop.ux.panel.Dialog', {
    extend: 'Ext.Panel',
    xtype: 'uxdialog',

    modal:true,
    minWidth: 600,
    width: 'auto',
    height: 'auto',
    closable:true,
    closeAction: 'onHide',
    hideMode: 'display',
    closeToolText: I18N.CloseToolText,
    floated: true,
    centered: true,
    border: true,
    bodyBorder: false,
    shadow: true,
    buttonsAlign: 'right',    
    focusable: false,
    tabIndex: -1,


    headerCls: Ext.baseCSSPrefix + 'dialogheader',
    titleCls: Ext.baseCSSPrefix + 'dialogtitle',
    toolCls: [
        Ext.baseCSSPrefix + 'paneltool',
        Ext.baseCSSPrefix + 'dialogtool'
    ],


    classCls: Ext.baseCSSPrefix + 'dialog', 

    buttonDefaults:{
        ui: 'action',
        margin: '0 5',
        style: 'line-height:24px;'
    },

    onHide: function(){
        this.hide();
    },

});