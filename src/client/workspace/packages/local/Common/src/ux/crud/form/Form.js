Ext.define('Common.ux.crud.form.Form',{
    extend: 'Common.ux.form.Base',

    mixins:[
        'Common.mixin.component.field.Id',
        'Common.mixin.component.field.ConcurrencyStamp'
    ],

    requires:[
        'Common.ux.crud.form.FormController',
    ],

    hasSaveAndNew: true,
    hasReset: true,
    minWidth: 600,

    controller: 'uxcrudformcontroller',


})