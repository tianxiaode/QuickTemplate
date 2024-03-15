Ext.define('Common.ux.button.QueryScope',{
    extend: 'Ext.Button',
    xtype: 'uxqueryscopebutton',

    mixins:[
        'Common.mixin.QueryScope'
    ]
})