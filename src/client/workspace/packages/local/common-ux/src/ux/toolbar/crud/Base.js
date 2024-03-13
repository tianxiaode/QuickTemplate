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
    ],

    userCls: 'bg-content',
    weighted: true,
    isCrudToolbar: true,

    config:{
        createButton:{ crudName: 'create' , weight: 100 },
        trashButton: { crudName: 'trash'  , weight: 300 },
        refreshButton:{ crudName:'refresh', weight: 400 },
        searchField: { weight: 900 },
        spacer:{ weight: 1000 },
        countMessage:{ weight: 1100 }
    }


})
