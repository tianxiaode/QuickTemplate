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
            weighted: true,
            defaultTabUI: 'light',
            activeTab: 0,
        },
    },

    defaultTabs: null,
    tabs:null,
    currentPage: null,
    isPassingResource: true,

    createTabBar(newCmp){
        let me = this,            
            tabs = [],
            config = me.isPhone() ? {
                scrollable: true,
                layout:{ pack: 'left', overflow: 'scroller' },
                defaults:{ minWidth: 100}
            } : {
                layout:{ pack: 'left',},
            };
        
        me.adjustTabs(tabs, me.defaultTabs);
        me.adjustTabs(tabs, me.tabs);

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

    adjustTabs(tabs, pending){
        pending = pending || [];
        pending.forEach(p=>{
            if (p.permission && !ACL.isGranted(p.permission)) return;
            tabs.push(p);
        })
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
        me.currentPage.setHidden(false);
    },

    onTabTap(sender, newTab){
        let me = this,
            pageItemId = newTab.pageItemId,
            item = me.down('#' + pageItemId),
            tabBar = me.getTabBar(),
            current = me.currentPage;
        
        current && current.setHidden(true);
        if(!item){
            item = me.add(me.getViewConfig(newTab.pageType, newTab.pageItemId));
        }
        tabBar.setActiveTab(null);
        tabBar.setActiveTab(newTab);
        me.currentPage = item;
        item.setHidden(false);

    },

    getViewConfig(xtype, itemId){
        let me = this,
            cfg = { xtype: xtype, itemId: itemId, flex:1 };
        if(!me.isPassingResource) return cfg;
        return Ext.apply(cfg,{
            resourceName: me.getResourceName(),
            entityName: me.getEntityName(),
            permissionGroup: me.permissionGroup,
            permissionName: me.permissionName,
        })
    },

})
