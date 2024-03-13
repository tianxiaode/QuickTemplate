Ext.define('Common.mixin.button.Export', {
    extend: 'Common.mixin.Component',

    config: {
        exportButton: null
    },

    createExportButton(config) {
        return Ext.apply({
            xtype: 'button',
            langTooltip: 'Export',
            iconCls: IconCls.export,
            handler: 'onExportButtonTap',
            isCrud: true,
            crudName: 'export',
            weight: 600,
            ownerCmp: this
        }, config, this.getDefaults());
    },

    applyExportButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createExportButton');
    },

    updateExportButton(config) {
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('exportButton');
    }


})
