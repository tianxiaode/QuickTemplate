Ext.define('Common.view.identity.roles.Multilingual', {
    extend: 'Common.ux.multilingual.Form',
    xtype : 'rolemultilingualview', 

    requires:[
        'Common.view.identity.roles.MultilingualDialog'
    ],

    minWidth: 500,
    fields: [ {name: 'name', label: 'RoleName'}],

    editDialog: 'common-rolemultilingualdialog',
    
});
  