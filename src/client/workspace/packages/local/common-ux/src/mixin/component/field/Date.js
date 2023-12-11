Ext.define('Common.mixin.component.field.Date', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.panel.Date'
    ],

    config: {
        date: {}
    },


    createDate(config) {
        return Ext.apply({
            xtype: 'uxdatepanel',
            fieldType: 'date',
            hidden: true,
            autoLabel: false,
            ownerCmp: this,
        }, config);
    },

    applyDate(config, old) {
        return Ext.updateWidget(old, config,this, 'createDate');
    },

    updateDate(config){
        config && this.add({ xtype: 'container', layout: 'center', items:[config]});
    },

    doDestroy(){
        this.setDate(null);
    }


})
