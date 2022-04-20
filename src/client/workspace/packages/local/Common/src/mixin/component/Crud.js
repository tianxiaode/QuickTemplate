Ext.define('Common.mixin.component.Crud', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.button.Create',
        'Common.ux.button.Update',
        'Common.ux.button.Trash',
    ],

    hasCreate: true,
    hasUpdate: true,
    hasDelete: true,

    config:{
        createButton:{
            xtype: 'uxcreatebutton',
            isCrud: true,
            crudName: 'create',
            hidden: true,
            handler: 'onCreate',
        },
        updateButton:{
            xtype: 'uxupdatebutton',
            isCrud: true,            
            crudName: 'update',
            hidden: true,
            disabled:true,
            handler: 'onUpdate', 
        },
        deleteButton:{
            xtype: 'uxtrashbutton',
            isCrud: true,
            crudName: 'delete',
            hidden: true,
            disabled:true,
            handler: 'onDelete',
        },
    },


    createCreateButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyCreateButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createCreateButton');
    },


    createUpdateButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyUpdateButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createUpdateButton');
    },


    createDeleteButton(newCmp) {
        
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyDeleteButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createDeleteButton');
    },

    initialize(){
        let me = this,
            container = me.getMixinContainer();
        me.hasCreate && container.add(me.getCreateButton());
        me.hasUpdate && container.add(me.getUpdateButton());
        me.hasDelete && container.add(me.getDeleteButton());
    }


})
