Ext.define('Common.mixin.component.field.DateTime', {
    extend: 'Common.mixin.component.Base',

    requires:[
        'Common.ux.panel.DateTime'
    ],

    config: {
        datetime: {}
    },

    createDateTime(config) {
        return Ext.apply({
            xtype: 'uxdatetimepanel',
            fieldType: 'dateTime',
            hidden: true,
            autoLabel: false,
            ownerCmp: this,
        }, config);
    },

    applyDateTime(config, old) {
        return Ext.updateWidget(old, config, this, 'createDateTime');
    },

    updateDateTime(config){
        config && this.add({ xtype: 'container', layout: 'center', items:[config]});
    },

    doDestroy(){
        this.setDatetime(null);
    }


})
