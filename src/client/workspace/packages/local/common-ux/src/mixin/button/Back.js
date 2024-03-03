Ext.define('Common.mixin.button.Back', {
    extend: 'Common.mixin.Component',

    config: {
        backButton: {}
    },

    createBackButton(config) {
        let me = this,
            handler = 'onBackButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            iconCls : 'md-icon-arrow-back',
            weight : -100,
            ui: 'plain',
            ownerCmp: me,
            handler: handler
        }, config);
    },

    applyBackButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createBackButton');
    },

    updateBackButton(config){
        config && this.add(config);
    },

    onBackButtonTap(){
        Ext.History.back();
    },

    doDestroy(){
        this.destroyMembers( 'backButton');
    }


})
