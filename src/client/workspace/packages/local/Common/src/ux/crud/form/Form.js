Ext.define('Common.ux.crud.form.Form',{
    extend: 'Common.ux.form.Base',

    requires:[
        'Common.ux.crud.form.FormController',
    ],

    hasSaveAndNew: true,
    hasReset: true,
    minWidth: 600,

    controller: 'uxcrudformcontroller',


})