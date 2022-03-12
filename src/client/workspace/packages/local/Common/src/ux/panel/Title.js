
Ext.define('Common.ux.panel.Title',{
    extend: 'Ext.Component',
    xtype: 'uxpaneltitle',

    mixins: [
        'Ext.mixin.Toolable'
    ],
    
    classCls: Ext.baseCSSPrefix + 'ux-panel-title',

    getTemplate() {
        var template = {
            reference: 'bodyElement',
            cls: Ext.baseCSSPrefix + 'body-el fs-6 text-black-50',
            uiCls: 'body-el'
        };

        return [template];
    },

})
