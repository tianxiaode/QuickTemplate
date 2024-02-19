Ext.define('Common.mixin.component.Refresh', {
    extend: 'Common.mixin.component.Base',

    requires: [
        'Common.ux.button.Refresh'
    ],


    config: {
        refreshButton: {}
    },

    createRefreshButton(config) {
        return Ext.apply({
            xtype: 'uxrefreshbutton',
            handler: 'onRefreshStore',
            ownerCmp: this,
        }, config);
    },

    applyRefreshButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createRefreshButton');
    },

    updateRefreshButton(config) {
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('refreshButton');
    },

    privates:{
        onRefreshButtonClick(sender){
            this.fireEvent('refresh', this, sender);
        }

    }



})
