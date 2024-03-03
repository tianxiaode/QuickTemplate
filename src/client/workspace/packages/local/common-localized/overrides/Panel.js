Ext.define('Common.overrides.Panel',{
    override: 'Ext.Panel',

    config:{
        langTitle: null,
    },


    onLocalized(){
        let me = this,
            title = me.getLangTitle(),
            collapsible = me.getCollapsible && me.getCollapsible();
        if(me.closeTool){
            me.closeTool.setTooltip({ zIndex:20, html: I18N.get('Close') });
        }
        if(collapsible){
            collapsible.setCollapseToolText(I18N.get('CollapseToolText'));
            collapsible.setExpandToolText(I18N.get('ExpandToolText'));
        }

        title = me.getLocalizedText(title);
        
        title && me.setTitle(title);

        me.callParent();
    },

   
});
 