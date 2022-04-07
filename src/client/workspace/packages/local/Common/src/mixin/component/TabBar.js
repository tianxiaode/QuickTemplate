Ext.define('Common.mixin.component.TabBar', {
    extend: 'Ext.Mixin',

    requires:[
        'Ext.tab.Bar',
        'Ext.layout.overflow.Scroller'
    ],

    config: {
        tabBar: {
            xtype: 'tabbar',
            ui: 'light',
            defaultTabUI: 'light',
            activeTab: 0,
        },
    },

    defaultTabs: [],
    tabs:[],
    currentPage: null,

    createTabBar(newCmp){
        let me = this,            
            defaults = me.defaultTabs,
            tabs = [...me.tabs,...defaults],
            config = me.isPhone() ? {
                scrollable: true,
                layout:{ pack: 'left', overflow: 'scroller' },
                defaults:{ minWidth: 100}
            } : {
                layout:{ pack: 'left',},
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
        me.currentPage = me.add(me.getViewConfig(first.pageType, first.pageItemId));
    },

    onTabTap(sender, newTab){
        let me = this,
            pageItemId = newTab.pageItemId,
            item = me.down('#' + pageItemId),
            tabBar = me.getTabBar(),
            current = me.currentPage;
        
        currentPage && current.setHidden(true);
        if(!item){
            item = me.add(me.getViewConfig(newTab.pageType, newTab.pageItemId));
        }
        tabBar.setActiveTab(null);
        tabBar.setActiveTab(newTab);
        me.currentPage = item;
        item.setHidden(false);

    },

    getViewConfig(xtype, itemId){
        return { 
            xtype: xtype,
            includeResource: true,
            resourceName: this.getResourceName(), 
            entityName: this.getEntityName(),
            itemId: itemId, 
            flex:1
        }
    },

})
