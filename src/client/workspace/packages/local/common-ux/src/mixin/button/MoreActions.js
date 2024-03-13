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
        let menuItems = [];
        if (this.showPagingMenu) {
            menuItems.push({
                xtype: 'menucheckitem',
                handler: 'onShowPagingMenuTap',
                text: '显示分页工具栏'
            })
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
        }, config, this.getDefaults());
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
