Ext.define('Common.mixin.component.Form', {
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.button.Save',
        'Common.ux.button.SaveAndNew',
        'Common.ux.button.Reset'
    ],

    hasSave: true,
    hasSaveAndNew: false,
    hasReset: false,
    hasCancel: true,

    config: {
        saveButton:{
            xtype: 'uxsavebutton',
            handler: 'onSave'
        },
        saveAndNewButton:{
            xtype: 'uxsaveandnewbutton',
            handler: 'onSaveAndNew'
        },
        resetButton:{
            xtype: 'uxresetbutton',
            handler: 'onReset'
        },
        cancelButton:{
            xtype: 'button',
            handler: 'onCancel',
            ui : 'soft-grey',
            weight: 300,
            langText: 'Cancel',
            userCls: 'lh-24',
        },
    },

    createSaveButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applySaveButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createSaveButton');
    },

    createSaveAndNewButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applySaveAndNewButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createSaveAndNewButton');
    },


    createResetButton(newCmp) {
        let isPhone = this.isPhone();
        
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyResetButton(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createResetButton');
    },

    createCancelButton(newCmp) {
        return Ext.apply({
            ownerCmp: this,
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
        !me.isPhone() && me.hasCancel && container.add(me.getCancelButton());        
    },

})
