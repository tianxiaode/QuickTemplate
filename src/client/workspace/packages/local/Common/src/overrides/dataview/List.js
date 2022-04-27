Ext.define("Common.overrides.dataview.List", {
    override: "Ext.dataview.List",

    onLocalized(){
        let me = this;
        let collapsible = me.getCollapsible();
        if(collapsible){
            if(collapsible.setCollapseToolText) collapsible.setCollapseToolText(I18N.get('CollapseThisGroup'));
            if(collapsible.setExpandToolText) collapsible.setExpandToolText(I18N.get('ExpandTisGroup'));
        }
        me.callParent();
    },



});
