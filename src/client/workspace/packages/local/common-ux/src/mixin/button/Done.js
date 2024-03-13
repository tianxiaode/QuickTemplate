Ext.define('Common.mixin.button.Done', {
    extend: 'Common.mixin.Component',

    config: {
        doneButton: null
    },

    createDoneButton(config) {
        return Ext.apply({
            xtype: 'button',
            ui: 'plain',
            iconCls: IconCls.done,
            handler: 'onDoneButtonTap',
            ownerCmp: this
        }, config, this.getDefaults());
    },

    applyDoneButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createDoneButton');
    },

    updateDoneButton(config){
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('doneButton');
    }


})
