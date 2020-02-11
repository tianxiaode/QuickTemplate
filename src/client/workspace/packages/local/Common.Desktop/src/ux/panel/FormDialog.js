/**
 * 使用表单面板作为对话框
 */
Ext.define('Common.Desktop.ux.panel.FormDialog', {
    extend: 'Ext.form.Panel',
    xtype: 'uxformdialog',

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
    header:{
        border: false
    },


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