Ext.define('Common.mixin.component.Form', {
    extend: 'Common.mixin.component.Base',


    hasSave: true,
    hasSaveAndNew: false,
    hasReset: false,
    hasCancel: true,

    config: {
        saveButton:{
            xtype: 'button',
            handler: 'onSave'
        },
        saveAndNewButton:{
            xtype: 'button',
            handler: 'onSaveAndNew'
        },
        resetButton:{
            xtype: 'button',
            handler: 'onReset'
        },
        cancelButton:{
            xtype: 'button',
            handler: 'onCancel'
        },
    },

    createSaveButton(newCmp) {
        let isPhone = Ext.platformTags.phone;
        
        return Ext.apply({
            ownerCmp: this,
            ui : (isPhone && 'plain') || 'action',
            weight: (isPhone && 80) || 80,
            iconCls: isPhone && 'md-icon-done',
            langText: !isPhone && 'Save',
            margin: '0 5px 0 0',
            userCls: !isPhone && 'lh-24',
        }, newCmp);
    },

    applySaveButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createSaveButton');
    },

    createSaveAndNewButton(newCmp) {
        let isPhone = Ext.platformTags.phone;
        
        return Ext.apply({
            ownerCmp: this,
            ui : (isPhone && 'plain') || 'action',
            weight: (isPhone && 70) || 70,
            iconCls: isPhone && 'md-icon-add',
            langText: !isPhone && 'SaveAndNew',
            margin: '0 5px 0 0',
            userCls: !isPhone && 'lh-24',
        }, newCmp);
    },

    applySaveAndNewButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createSaveAndNewButton');
    },


    createResetButton(newCmp) {
        let isPhone = Ext.platformTags.phone;
        
        return Ext.apply({
            ownerCmp: this,
            ui : (isPhone && 'plain') || 'soft-purple',
            weight: (isPhone && 60) || 90,
            iconCls: isPhone && 'md-icon-undo',
            langText: !isPhone && 'Reset',
            margin: '0 5px 0 0',
            userCls: !isPhone && 'lh-24',
        }, newCmp);
    },

    applyResetButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createResetButton');
    },

    createCancelButton(newCmp) {
        let isPhone = Ext.platformTags.phone;
        
        return Ext.apply({
            ownerCmp: this,
            ui : (isPhone && 'plain') || 'soft-grey',
            weight: (isPhone && 60) || 300,
            iconCls: isPhone && 'md-icon-undo',
            langText: !isPhone && 'Cancel',
            userCls: !isPhone && 'lh-24',
        }, newCmp);
    },

    applyCancelButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createCancelButton');
    },

    initialize(){
        let me = this,
            container = me.getMixinContainer();
        me.hasSave && container.add(me.getSaveButton());
        me.hasSaveAndNew && container.add(me.getSaveAndNewButton());
        me.hasReset && container.add(me.getResetButton());
        me.hasCancel && container.add(me.getCancelButton());        
    },

})
