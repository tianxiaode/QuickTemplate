Ext.define('Common.mixin.button.Import', {
    extend: 'Common.mixin.Component',

    config: {
        importButton: null
    },

    createImportButton(config) {
        let me = this,
            handler = 'onImportButtonTap';
        if(me[handler]) handler = me[handler].bind(me);
        return Ext.apply({
            xtype: 'button',
            ui: 'success',
            langTooltip: 'Import',
            iconCls: 'x-fa fa-file-import',
            handler: handler,
            ownerCmp: me
        }, config);
    },

    applyImportButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createImportButton');
    },

    updateImportButton(config){
        config && this.add(config);
    },


    doDestroy(){
        this.destroyMembers( 'importButton');
    }


})
