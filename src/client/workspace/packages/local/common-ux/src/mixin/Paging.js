Ext.define('Common.mixin.Paging',{
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.toolbar.Paging'
    ],

    config:{
        paging: null,
        pagingDefaults: {
            xtype: 'uxpagingtoolbar',
            weight: 300,
            mixinName: 'paging'
        }
        
    },


    applyPaging(config, old) {
        return Ext.updateWidget(old, config,this, 'getComponentConfig', 'pagingDefaults');
    },

    updatePaging(config){
        config && this.add(config);
    }



})