Ext.define('Common.shared.view.pages.Page404',{
    extend: 'Common.shared.view.BasePage',
    xtype: 'shared-page404',

    title: 'CompanyShortName',

    items:[
        {
            xtype: 'component',
            html: '<p class="text-center m-0 p-0 error-code text-secondary">404</p>'
        },
        {
            xtype: 'component',
            localized: [ 'html'],
            html: 'Page404Text'
        }
    ]

})