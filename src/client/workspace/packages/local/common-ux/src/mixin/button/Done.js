Ext.define('Common.mixin.button.Done', {
    extend: 'Common.mixin.Component',

    config: {
        doneButton: null
    },

    createDoneButton(config) {
        let me = this,
            handler = 'onDoneButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'plain',
            iconCls: 'x-fa fa-check',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyDoneButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createDoneButton');
    },

    updateDoneButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'doneButton');
    }


})
