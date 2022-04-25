Ext.define('Common.ux.multilingual.Form',{
    extend: 'Common.ux.form.Base',
    xtype: 'multilingualview',

    requires:[
        'Common.ux.multilingual.FormController',
        'Common.ux.multilingual.Edit',
    ],

    mixins:[
        'Common.ux.multilingual.mixin.List',
    ],

    controller: 'multilingualformcontroller',
    hasMessageButton: true,
    minWidth:500,
    maxWidth: 500,
    minHeight: 500,
    maxHeight: 600

})