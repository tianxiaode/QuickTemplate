Ext.define('Common.mixin.component.DateTime', {
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.panel.DateTime'
    ],

    mixinConfig: {
        configs: true,
    },

    config: {
        date: {
            xtype: 'uxdatetimepanel',
            inputType: 'dateTime',
            hidden: true,
            autoLabel: false,
        },
    },

    hasDateTime: false,

    createDateTime(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyDateTime(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createDateTime');
    },

    updateDateTime(config){
        this.hasDateTime && config && this.add({ xtype: 'container', layout: 'center', items:[config]});
    },


})
