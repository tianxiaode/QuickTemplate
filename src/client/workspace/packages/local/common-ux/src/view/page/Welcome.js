Ext.define('Common.view.page.Welcome',{
    extend: 'Common.view.page.Base',
    xtype: 'welcome',

    bodyCls: 'bg-lock-screen',
    items:[
        {
            xtype: 'component',
            itemId: 'logo'
        },
        {
            xtype: 'component',
            itemId: 'gettingStarted'
        }
    ],

    onLocalized(){
        let me = this;
        me.callParent();
        me.down('#logo').setHtml(`<p class="text-center"><img class="w-50" src="${AppConfig.authority}/images/logo.png"></p>`);
        me.down('#gettingStarted').setHtml(`<p class="text-center"><a href="./" class="display1">${I18N.get('GettingStarted')}</a></p>`);
    }

})