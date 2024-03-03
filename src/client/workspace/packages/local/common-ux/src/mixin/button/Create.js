Ext.define('Common.mixin.button.Create', {
    extend: 'Common.mixin.Component',

    config: {
        createButton: null
    },

    createCreateButton(config) {
        let me = this,
            handler = 'onCreateButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'success',
            langTooltip: 'Add',
            iconCls: 'x-fa fa-file',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyCreateButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createCreateButton');
    },

    updateCreateButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'createButton');
    }


})
