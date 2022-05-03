Ext.define('Common.view.settings.BaseForm',{
    extend: 'Common.ux.form.Base',

    requires:[
        'Common.view.settings.BaseFormController'
    ],

    controller: 'settingbaseformcontroller',
    hasBack:false,
    hasSaveAndNew: false,
    hasCancel: false,
    hasReset: true,
    hidden: true,
    title: null,

    buttons:[
        {
            xtype: 'component',
            flex: 1,
            weight: 5
        },
        {
            xtype: 'component',
            flex: 1,
            weight: 500
        }
    ],

    getMixinContainer(){
        return this.down('#buttonToolbar')
    },

})