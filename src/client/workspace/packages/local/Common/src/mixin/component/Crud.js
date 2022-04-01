Ext.define('Common.mixin.component.Crud', {
    extend: 'Common.mixin.component.Base',


    hasCreate: true,
    hasUpdate: true,
    hasDelete: true,

    config:{
        createButton:{
            xtype: 'button',
            isCrud: true,
            crudName: 'create',
            hidden: true,
            handler: 'onCreate',         
        },
        updateButton:{
            xtype: 'button',
            isCrud: true,            
            crudName: 'update',
            disabled: true,
            hidden: true,
            handler: 'onUpdate',         
        },
        deleteButton:{
            xtype: 'button',
            isCrud: true,
            crudName: 'delete',
            disabled: true,
            hidden: true,
        },
    },


    createCreateButton(newCmp) {
        let isPhone = Ext.platformTags.phone;
        
        return Ext.apply({
            ownerCmp: this,
            ui : isPhone && 'plain',
            weight: (isPhone && 50) || 70,
            iconCls: (isPhone && 'md-icon-add') || 'x-fa fa-file text-success',
            langToolTip: !isPhone && 'Add',
        }, newCmp);
    },

    applyCreateButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createCreateButton');
    },


    createUpdateButton(newCmp) {
        let isPhone = Ext.platformTags.phone;
        
        return Ext.apply({
            ownerCmp: this,
            ui : (isPhone && 'plain') || 'defaults' ,
            weight: (isPhone && 60) || 80,
            iconCls: (isPhone && 'md-icon-edit') || 'x-fa fa-edit',
            langToolTip: !isPhone && 'Update',
        }, newCmp);
    },

    applyUpdateButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createUpdateButton');
    },


    createDeleteButton(newCmp) {
        let isPhone = Ext.platformTags.phone;
        
        return Ext.apply({
            ownerCmp: this,
            ui : (isPhone && 'plain') || 'soft-red' ,
            weight: (isPhone && 70) || 90,
            iconCls: (isPhone && 'md-icon-delete') || 'x-fa fa-trash',
            langToolTip: !isPhone && 'Delete',
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
