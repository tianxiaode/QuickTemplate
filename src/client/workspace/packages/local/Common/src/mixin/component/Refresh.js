Ext.define('Common.mixin.component.Refresh', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.button.Refresh'
    ],

    hasRefresh: true,

    config: {
        refreshButton: {
            xtype: 'uxrefreshbutton',
            handler: 'onRefreshStore', 
        },
    },

    createRefreshButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyRefreshButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createRefreshButton');
    },

    initialize(){
        let me = this,
            container = me.getMixinContainer();
        me.hasRefresh && container.add(me.getRefreshButton());
    }



})
