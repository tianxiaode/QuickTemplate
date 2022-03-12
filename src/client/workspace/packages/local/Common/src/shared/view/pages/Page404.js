Ext.define('Common.view.pages.Page404',{
    extend: 'Common.view.BasePage',
    xtype: 'shared-page404',

    langTitle: 'CompanyShortName',
    
    items:[
        {
            xtype: 'component',
            html: '<p class="text-center m-0 p-0 error-code text-secondary">404</p>'
        },
        {
            xtype: 'component',
            langHtml: 'Page404Text'
        }
    ]

})