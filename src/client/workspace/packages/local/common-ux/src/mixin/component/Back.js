Ext.define('Common.mixin.component.Back', {
    extend: 'Common.mixin.Component',

    config: {
        backButton: {}
    },

    createBackButton(config) {
        let me = this;
        return Ext.apply({
            xtype: 'button',
            iconCls : 'md-icon-arrow-back',
            weight : -100,
            ui: 'plain',
            ownerCmp: me,
            handler: me.onBack,
            scope: me
        }, config);
    },

    applyBackButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createBackButton');
    },

    updateBackButton(config){
        config && this.add(config);
    },

    onBack(){
        Ext.History.back();
    },

    doDestroy(){
        this.destroyMembers( 'backButton');
    }


})
