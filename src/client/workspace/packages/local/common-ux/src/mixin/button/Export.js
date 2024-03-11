Ext.define('Common.mixin.button.Export', {
    extend: 'Common.mixin.Component',

    config: {
        exportButton: null
    },

    createExportButton(config) {
        let me = this,
            handler = 'onExportButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            langTooltip: 'Export',
            iconCls: IconCls.export,
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyExportButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createExportButton');
    },

    updateExportButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'exportButton');
    }


})
