Ext.define('Common.mixin.button.Import', {
    extend: 'Common.mixin.Component',

    config: {
        importButton: null
    },

    createImportButton(config){
        return Ext.apply({
            xtype: 'button',
            langTooltip: 'Import',
            iconCls: IconCls.import,
            handler: 'onImportButtonTap',
            isCrud: true,
            crudName: 'import',
            weight: 500,
            ownerCmp: this
        }, config, this.getDefaults());
    },

    applyImportButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createImportButton');
    },

    updateImportButton(config) {
        config && this.add(config);
    },

    doDestroy(){
        this.destroyMembers('importButton');
    }



})
