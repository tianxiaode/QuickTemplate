Ext.define('Common.Desktop.pages.Error500Window', {
    extend: 'Common.Desktop.pages.ErrorBase',
    xtype: 'page500',

    requires: [
    ],

    items: [
        {
            xtype: 'container',
            width: 600,
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
                    html: '500'
                },
                {
                    xtype: 'label',
                    cls: 'error-page-desc',
                    html: I18N.Error500HTML
                },
                {
                    xtype: 'component',
                    flex: 1
                }
            ]
        }
    ]
});
