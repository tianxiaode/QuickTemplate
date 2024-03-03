Ext.define('Common.mixin.button.Trash', {
    extend: 'Common.mixin.Component',

    config: {
        trashButton: null
    },

    createTrashButton(config) {
        let me = this,
            handler = 'onTrashButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'danger',
            langTooltip: 'Delete',
            iconCls: 'x-fa fa-trash',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyTrashButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createTrashButton');
    },

    updateTrashButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'trashButton');
    }


})
