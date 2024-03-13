Ext.define('Common.ux.toolbar.crud.Base', {
    extend: 'Ext.Toolbar',
    xtype: 'uxcrudtoolbar',

    mixins: [
        'Common.mixin.button.Create',
        'Common.mixin.button.Update',
        'Common.mixin.button.Trash',
        'Common.mixin.button.Refresh',
        'Common.mixin.button.Import',
        'Common.mixin.button.Export',
        'Common.mixin.button.Search',
        'Common.mixin.button.Reset',
        'Common.mixin.button.Help',
        'Common.mixin.Spacer',
        'Common.mixin.CountMessage',
        'Common.mixin.field.Search',
        'Common.mixin.button.MoreActions',        
    ],

    userCls: 'bg-content',
    weighted: true,
    isCrudToolbar: true,    

    config:{
        createButton: true,
        trashButton: true,
        refreshButton: true,
        searchField: { weight: 500},
        spacer: { weight: 1000},
        countMessage: { weight:1100 },
        moreActionsButton: true
    }


})
