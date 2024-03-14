Ext.define('Common.mixin.Paging',{
    extend: 'Common.mixin.Component',

    requires:[
        'Common.ux.toolbar.Paging'
    ],

    config:{
        paging: null,

        /**
         * @cfg {String} pagingMode
         * The mode of grid paging. Can be 'none', 'listpaging' or 'toolbar'.
         */
        pagingMode: 'listpaging'
    },

    listPagingPlugin: null,

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

    updatePagingMode(mode, oldMode) {
        let me = this,
            list = me.getList() || me;
        if (mode === 'toolbar') {
            if(me.listPagingPlugin){
                list.removePlugin(me.listPagingPlugin, true);
                me.listPagingPlugin = null;
            }
            me.setPaging({});
        };

        if(mode === 'listpaging'){
            me.setPaging(null);
            me.listPagingPlugin = list.addPlugin({
                type: 'listpaging',
                autoPage: true
            });
        }

        me.afterUpdatePagingMode && me.afterUpdatePagingMode(mode, oldMode);
    },


    doDestroy() {
        this.destroyMembers('paging', 'listPagingPlugin');
    }

})