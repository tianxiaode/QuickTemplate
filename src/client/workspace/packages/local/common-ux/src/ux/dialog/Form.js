Ext.define('Common.ux.dialog.Form',{
    extend: 'Common.ux.dialog.Base',
    xtype: 'uxformdialog',

    mixins:[
        'Common.mixin.component.Toolbar'
    ],

    weighted: true,
    form: {weight: 100},
    toolbar:{ weight: 200 },

    



})