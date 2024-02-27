Ext.define('Common.mixin.component.Toolbar', {
    extend: 'Common.mixin.Component',

    config: {
        toolbar: null
    },

    createToolBar(config) {
        return Ext.apply({
            xtype: 'toolbar',
            weighted: true,
            ownerCmp: this
        }, config);
    },

    applyToolbar(config, old) {
        return Ext.updateWidget(old, config, this, 'createToolBar');
    },

    updateToolbar(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('toolbar');
    }

});
