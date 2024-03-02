Ext.define('Common.ux.dialog.Form',{
    extend: 'Common.ux.dialog.Base',
    xtype: 'uxformdialog',

    mixins:[
        'Common.mixin.component.Form'
    ],

    weighted: true,
    form: {weight: 100},

    



})