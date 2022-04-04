Ext.define('Common.mixin.component.Date', {
    extend: 'Ext.Mixin',

    requires:[
        'Common.ux.panel.Date'
    ],

    mixinConfig: {
        configs: true,
    },

    config: {
        date: {
            xtype: 'uxdatepanel',
            inputType: 'date',
            hidden: true,
            autoLabel: false,
        },
    },

    hasDate: false,

    createDate(newCmp) {
        return Ext.apply({
            ownerCmp: this,
        }, newCmp);
    },

    applyDate(newCmp, old) {
        return Ext.updateWidget(old, newCmp,
            this, 'createDate');
    },

    updateDate(config){
        this.hasDate && config && this.add({ xtype: 'container', layout: 'center', items:[config]});
    },


})
