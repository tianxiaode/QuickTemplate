Ext.define('Phone.view.dashboard.MenuItem', {
    extend: 'Common.ux.dataview.ListItem',
    xtype: 'dashboardmenuitem',
    
    baseCls: Ext.baseCSSPrefix + 'menu-item',
    userCls: null,
    template: [
        {
            tag: 'p',
            children:[
                {
                    reference: 'iconElement',
                    tag: 'span',
                }
            ]
        },
        {
            reference: 'textElement',
            tag: 'p',
            cls: 'caption',
        }
    ],

    updateItem(record){
        let me = this,
            data = record.data;
        me.iconElement.dom.className = `icon x-fa ${data.iconCls} ${data.color}`;
        me.textElement.set({
            'lang-text': data.langText
        });
        me.onLocalized();
    },

    onLocalized(){
        let me = this,
            el = me.textElement,
            langText = el.getAttribute('lang-text');
        me.callParent();
        el.dom.innerHTML = I18N.get(langText);

    }

});