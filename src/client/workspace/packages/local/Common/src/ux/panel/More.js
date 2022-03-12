Ext.define('Common.ux.panel.More',{
    extend: 'Ext.Panel',
    xtype: 'uxmorepanel',

    requires:[
        'Ext.tab.Bar',
        'Ext.layout.overflow.Scroller'
    ],

    width: 480,
    maxWidth: 480,
    resizable: {
        split: true,
        edges: 'west'
    },
    layout: 'vbox',

    config:{
        defaultTabs: [],
        tabs:[],
        tabBar:{
            xtype: 'tabbar',
            ui: 'light',
            defaultTabUI: 'light',
            activeTab: 0,
        },
    },

    createTabBar(newCmp){
        let me = this,            
            defaults = me.getDefaultTabs(),
            tabs = [...me.getTabs(),...defaults],
            config =Ext.platformTags.phone ? {
                scrollable: true,
                layout:{
                    pack: 'left',
                    overflow: 'scroller'    
                },
                defaults:{
                    minWidth: 100
                }
            } : {
                layout:{
                    pack: 'left',
                },
            };
    
        config = Ext.apply({
            ownerCmp: me,
            items: tabs,
            listeners:{
                activeTabchange: me.onTabTap,
                scope: me
            }
        }, newCmp, config);
        return config;
    },

    applyTabBar(newCmp, old){
        return Ext.updateWidget(old, newCmp,
            this, 'createTabBar');
    },

    updateTabBar(config){     
        if(!config) return;
        let me = this,
            tabBar = me.add(config),
            first = tabBar.getAt(0);
        me.current = me.add(me.getViewConfig(first.pageType, first.pageItemId));
    },

    updateRecord(record){
        let me = this;
        me.switchTitle(me, record);
        me.refreshView(me, record);
    },

    switchTitle: Ext.emptyFn,

    refreshView(me, record){
        me.current.getController().onRefreshView();    
    },

    onTabTap(sender, newTab){
        let me = this,
            pageItemId = newTab.pageItemId,
            item = me.down('#' + pageItemId),
            tabBar = me.getTabBar(),
            current = me.current;
        
        current && current.setHidden(true);
        if(!item){
            item = me.add(me.getViewConfig(newTab.pageType, newTab.pageItemId));
        }
        tabBar.setActiveTab(null);
        tabBar.setActiveTab(newTab);
        me.current = item;
        item.setHidden(false);

    },

    getViewConfig(xtype, itemId){
        return { xtype: xtype,
            resourceName: this.resourceName, 
            entityName: this.entityName,
            itemId: itemId, 
            flex:1}
    },

});
