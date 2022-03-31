Ext.define('Common.mixin.component.Refresh', {
    extend: 'Common.mixin.component.Base',

    config: {
        refreshButton: {
            xtype: 'button',
            handler: 'onRefreshStore', 
        },
    },

    createRefreshButton(newCmp) {
        let isPhone = Ext.platformTags.phone;

        return Ext.apply({
            ownerCmp: this,
            ui : (isPhone && 'plain') || 'soft-cyan' ,
            weight: (isPhone && 80) || 200,
            iconCls: (isPhone && 'md-icon-refresh') || 'x-fa fa-undo',
            langToolTip: !isPhone && 'Refresh',
        }, newCmp);
    },

    applyRefreshButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createRefreshButton');
    },

    initMixinComponent(me, container){
        container.add(me.getRefreshButton());
    },



})
