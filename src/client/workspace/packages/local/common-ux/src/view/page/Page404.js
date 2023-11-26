Ext.define('Common.view.page.Page404',{
    extend: 'Common.view.page.Base',
    xtype: 'page404',

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