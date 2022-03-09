Ext.define('Common.shared.ux.AppTitle',{
    extend: 'Ext.Component',
    xtype: 'shared-apptitle',

    userCls: 'app-title',

    langHtml: 'CompanyFullName',
    includeResource: true,
    resourceName: 'Service',

    // initialize(){
    //     let me = this;
    //     me.callParent();
    //     me.setHtml(`${I18N.get('CompanyFullName', 'Service')} - ${}` );
    // },


})