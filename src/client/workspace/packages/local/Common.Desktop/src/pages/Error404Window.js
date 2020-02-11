Ext.define('Common.Desktop.pages.Error404Window', {
    extend: 'Common.Desktop.pages.ErrorBase',
    xtype: 'page404',

    requires: [
        'Ext.Label'
    ],

    items: [
        {
            xtype: 'container',
            width: 400,
            cls:'error-page-inner-container',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'error-page-top-text',
                    html: '404'
                },
                {
                    xtype: 'label',
                    cls: 'error-page-desc',
                    html: I18N.Error404HTML
                },
                {
                    xtype: 'component',
                    flex: 1
                }
            ]
        }
    ]
});
