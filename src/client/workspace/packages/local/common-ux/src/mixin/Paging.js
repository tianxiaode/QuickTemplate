Ext.define('Common.mixin.Paging',{
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.toolbar.Paging'
    ],

    config:{
        paging: null
    },

    createPaging(config){
        return Ext.apply({
            xtype: 'uxpagingtoolbar',
            weight: 300,
            ownerCt: this
        }, config);
    },

    applyPaging(config, old) {
        return Ext.updateWidget(old, config,this, 'createPaging');
    },

    updatePaging(config){
        config && this.add(config);
    },

    doDestroy() {
        this.destroyMembers('paging');
    }

})