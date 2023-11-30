Ext.define('Common.view.page.Page404',{
    extend: 'Common.view.page.Base',
    xtype: 'page404',

    bodyCls: 'bg-lock-screen',

    items:[
        {
            xtype: 'component',
            html: '<p class="text-center m-0 p-0 text-bold display4 text-alert">404</p>'
        },
        {
            xtype: 'component',
            langHtml: 'Page404Text'
        }
    ]

})