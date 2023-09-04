Ext.define('Common.ux.toolbar.Crud',{
    extend: 'Ext.Toolbar',
    xtype: 'uxcrudtoolbar',

    mixins:[
        'Common.mixin.component.Crud',
        'Common.mixin.component.CountMessage',
        'Common.mixin.component.SearchField',
        'Common.mixin.component.Search'
    ]

})