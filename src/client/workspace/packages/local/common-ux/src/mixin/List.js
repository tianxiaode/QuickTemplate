Ext.define('Common.mixin.List',{
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.grid.Grid',
        'Common.ux.grid.Tree',
        'Common.ux.dataview.List'
    ],

    config:{
        list: null,
        listDefaults: {
            actionColumnScope: true,
            mixinName: 'list'
        }
    },

    applyList(config, old) {
        return Ext.updateWidget(old, config,this, 'getComponentConfig', 'listDefaults');
    },

    updateList(config){
        config && this.add(config);
    }


})