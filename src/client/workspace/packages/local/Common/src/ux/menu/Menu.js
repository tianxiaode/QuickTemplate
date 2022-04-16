Ext.define('Common.ux.menu.Menu', {
    extend: 'Ext.menu.Menu',

    minWidth: 300,
    minHeight: 400,
    maxHeight: 600,
    maxWidth: 600,
    scrollable: true,
    anchor: true,
    bodyPadding: 10,  
    title: Ext.emptyString  ,
    headerCls: Ext.baseCSSPrefix + 'dialogheader',
    titleCls: Ext.baseCSSPrefix + 'dialogtitle',
    toolCls: [
        Ext.baseCSSPrefix + 'paneltool',
        Ext.baseCSSPrefix + 'dialogtool'
    ], 
     
    defaultListenerScope: true,
 
})