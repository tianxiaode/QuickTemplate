Ext.define('Common.ux.toolbar.Action', {
    extend: 'Ext.Toolbar',
    xtype: 'uxactiontoolbar',

    mixins:[
        'Common.mixin.component.Crud',
        'Common.mixin.component.CountMessage',
        'Common.mixin.component.Refresh',
        'Common.mixin.component.SearchField',
        'Common.mixin.component.Search'
    ],


    classCls: Ext.baseCSSPrefix + 'action',


})
