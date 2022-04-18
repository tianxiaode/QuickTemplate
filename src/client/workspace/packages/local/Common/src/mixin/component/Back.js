Ext.define('Common.mixin.component.Back', {
    extend: 'Common.mixin.component.Base',

    config: {
        backButton: {
            xtype: 'button',
            iconCls : 'md-icon-arrow-back',
            weight : -100,
            ui: 'plain'        
        },
    },

    hasBack: true,
    backMixinContainer: null,

    createBackButton(newCmp) {
        let me = this;
        return Ext.apply({
            ownerCmp: me,
            handler: me.onBack,
            scope: me
        }, newCmp);
    },

    applyBackButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createBackButton');
    },

    initialize(){
        let me = this,
            backMixinContainer = me.backMixinContainer,
            container = (backMixinContainer && me.down(backMixinContainer)) 
                || (me.getHeader && me.getHeader());
        if(!me.hasBack || !me.isPhone() || !container) return;
        container.add(me.getBackButton());
    },

    onBack(){
        Ext.History.back();
    },

})
