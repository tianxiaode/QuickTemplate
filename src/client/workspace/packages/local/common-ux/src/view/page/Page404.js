Ext.define('Common.view.page.Page404',{
    extend: 'Common.view.page.Base',
    xtype: 'page404',

    items:[
        {
            xtype: 'component',
            html: '<p class="text-center m-0 p-0 text-bold error-page-top-text text-alert">404</p>'
        },
        {
            xtype: 'component',
            langHtml: 'Page404Text',
            userCls: 'error-page-desc'
        }
    ]

})