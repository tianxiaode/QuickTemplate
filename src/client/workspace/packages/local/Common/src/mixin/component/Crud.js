Ext.define('Common.mixin.component.Crud', {
    extend: 'Common.mixin.component.Base',

    requires: [
        'Common.ux.button.Create',
        'Common.ux.button.Update',
        'Common.ux.button.Trash'
    ],

    config: {
        createButton: {},
        updateButton: null,
        deleteButton: {},
    },

    createCreateButton(config) {
        let weight = Ext.platformTags.desktop ? 100 : 300;
        return Ext.apply({
            xtype: 'uxcreatebutton',
            isCrud: true,
            crudName: 'create',
            hidden: true,
            handler: 'onCreate',
            weight: weight,
            ownerCmp: this,
        }, config);
    },

    applyCreateButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createCreateButton');
    },

    updateCreateButton(config) {
        config && this.add(config);
    },


    createUpdateButton(config) {
        let weight = 200;
        return Ext.apply({
            xtype: 'uxupdatebutton',
            weight: weight,
            isCrud: true,            
            crudName: 'update',
            hidden: true,
            disabled:true,
            handler: 'onUpdate', 
            ownerCmp: this
        }, config);
    },

    applyUpdateButton(config, old) {
        return Ext.updateWidget(old, config,this, 'createUpdateButton');
    },

    updateUpdateButton(config){
        config && this.add(config);
    },


    createDeleteButton(newCmp) {
        let weight = Ext.platformTags.desktop ? 300 : 100;
        return Ext.apply({
            xtype: 'uxtrashbutton',
            weight: weight,
            isCrud: true,
            crudName: 'delete',
            hidden: true,
            disabled: true,
            handler: 'onDelete',
            ownerCmp: this
        }, newCmp);
    },

    applyDeleteButton(config, old) {
        return Ext.updateWidget(old, config, this, 'createDeleteButton');
    },

    updateDeleteButton(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('createButton', 'updateButton', 'deleteButton');
    }


})
