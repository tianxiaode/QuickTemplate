Ext.define('Common.ux.toolbar.Dialog', {
    extend: 'Ext.Toolbar',
    xtype: 'uxdialogtoolbar',

    mixins: [
        'Common.mixin.button.Message',
        'Common.mixin.button.Reset',
        'Common.mixin.Spacer',
        'Common.mixin.button.SaveAndNew',
        'Common.mixin.button.Save',
        'Common.mixin.button.Cancel'
    ],

    config:{
        spacer: { weight: 200 },
        resetButton: { weight: 300, langTooltip: 'Reset' },
        saveButton: { weight: 400},
        cancelButton: { weight: 500},
    },

    defaultType: 'button',
    weighted: true,
    ui: 'footer',
    weighted: true,

    doDestroy() {
        this.destroyMembers('toolbar');
    }

})
