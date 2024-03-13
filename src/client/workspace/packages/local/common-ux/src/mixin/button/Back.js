Ext.define('Common.mixin.button.Back', {
    extend: 'Common.mixin.Component',

    config: {
        backButton: null
    },

    createBackButton(config) {
        return Ext.apply({
            xtype: 'button',
            ui: 'plain',
            iconCls: IconCls.left,
            weight: -100,
            handler: this.onBackButtonTap,
            ownerCmp: this
        }, config, this.getDefaults()); 
    },

    applyBackButton(config, old) {
        return Ext.updateWidget(old, config, this, 'backButton');
    },

    updateBackButton(config){
        config && this.add(config);
    },

    onBackButtonTap(){
        Ext.History.back();
    },

    doDestroy(){
        this.destroyMembers('backButton');
    }
})
