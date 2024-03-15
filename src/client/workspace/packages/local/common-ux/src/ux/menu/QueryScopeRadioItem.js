Ext.define('Common.ux.menu.QueryScopeRadioItem',{
    extend: 'Ext.menu.RadioItem',
    xtype: 'uxqueryscopemenuradioitem',

    mixins:[
        'Common.mixin.QueryScope'
    ]
})