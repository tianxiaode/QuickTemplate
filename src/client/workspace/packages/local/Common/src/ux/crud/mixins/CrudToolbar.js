Ext.define('Common.ux.crud.mixins.CrudToolbar',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
    },

    hasCountMessage: true,
    hasCrud: true,
    hasCreate: true,
    hasUpdate: true,
    hasDelete: true,
    hasSearch: true,
    crudToolbarDocked: 'top',
    crudToolbarWeight: null,
    hasCrudToolbar: true,


    config: {
        crudToolbar: {
            xtype: 'uxcrudtoolbar',
        },
    },

    createCrudToolbar(newCmp) {
        let me = this;
        return Ext.apply({
            ownerCmp: this,
            hasCountMessage: me.hasCountMessage,
            hasSearch: me.hasSearch,
            hasCrud: me.hasCrud,
            hasCreate: me.hasCreate,
            hasUpdate: me.hasUpdate,
            hasDelete: me.hasDelete,
            docked: me.crudToolbarDocked,
            weight: me.crudToolbarWeight
        }, newCmp);
    },

    applyCrudToolbar(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createCrudToolbar');
    },

    updateCrudToolbar(config){
        if(!this.hasCrudToolbar || !config) return;
        this.add(config);
    },

})