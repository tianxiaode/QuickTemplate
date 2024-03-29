Ext.define('Common.mixin.button.MoreActions', {
    extend: 'Common.mixin.Component',

    requires: [
        'Ext.menu.CheckItem'
    ],

    config: {
        moreActionsButton: null
    },
    showPagingMenu: true,


    createMoreActionsButton(config) {
        let menuItems = [],
            defaults = this.getDefaults();
        if (this.showPagingMenu) {
            let item = {
                xtype: 'menucheckitem',
                handler: 'onShowPagingMenuTap',
                langText: 'PagingToolbar'
            }
            if(defaults && defaults.queryScope){
                item.queryScope = defaults.queryScope;
            }
            menuItems.push(item)
        };
        return Ext.apply({
            xtype: 'button',
            iconCls: IconCls.menu,
            langTooltip: 'MoreActions',
            isCrud: true,
            crudName: 'moreactions',
            weight: 1300,
            arrow: false,
            menuAlign: 'br',
            menu: {
                minWidth: 300,
                items: menuItems,
                flex: 1,
            },
            ownerCmp: this,
        }, config, defaults);
    },


    applyMoreActionsButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createMoreActionsButton');
    },

    updateMoreActionsButton(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('moreActionsButton');
    }



})
