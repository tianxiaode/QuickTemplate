Ext.define('Common.ux.toolbar.crud.Multiline', {
    extend: 'Ext.Container',
    xtype: 'uxcrudmultilinetoolbar',

    mixins:[
        'Common.mixin.Toolbar'
    ],
    
    config: {
        toolbar: {
            xtype: 'uxcrudtoolbar'
        }
    },

    userCls: 'bg-content',
    weighted: true,
    isCrudToolbar: true,
    layout: 'vbox'
})
