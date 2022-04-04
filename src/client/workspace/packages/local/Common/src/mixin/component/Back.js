Ext.define('Common.mixin.component.Back', {
    extend: 'Common.mixin.component.Base',

    config: {
        backButton: {
            xtype: 'button',
            iconCls : 'md-icon-arrow-back',
            handler: 'onBack', 
            weight : -100,
            ui: 'plain'        
        },
    },

    hasBack: true,

    createBackButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyBackButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createBackButton');
    },

    initialize(){
        let me = this,
            container = (me.isFormPanel && me.getHeader()) ||  me.getMixinContainer();
        if(!me.hasBack || !me.isPhone() || !container) return;
        container.add(me.getBackButton());
    },

})
