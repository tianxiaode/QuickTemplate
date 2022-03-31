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
        let header = this.getHeader && this.getHeader();
        header && header.add(ths.getBackButton());
    },

})
