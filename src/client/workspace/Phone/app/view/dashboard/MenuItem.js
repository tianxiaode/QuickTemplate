Ext.define('Phone.view.dashboard.MenuItem', {
    extend: 'Common.ux.dataview.ListItem',
    xtype: 'dashboardmenuitem',
    
    baseCls: 'main-menu-item',
    userCls: null,
    template: [
        {
            cls: 'icon-wrap',
            children:[
                {
                    reference: 'iconElement',
                    cls: 'icon'
                }
            ]
        },
        {
            reference: 'textElement',
            tag: 'p',
        }
    ],

    updateListItem(record){
        let me = this,
            data = record.data;
        me.iconElement.dom.className = `icon x-fa ${data.iconCls} ${data.color}`;
        me.textElement.setHtml(I18N.get(data.langText));
    },


});