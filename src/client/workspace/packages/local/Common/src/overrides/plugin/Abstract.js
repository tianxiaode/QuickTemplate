Ext.define('Common.overrides.plugin.Abstract',{
    override: 'Ext.plugin.Abstract',

    config:{
        originLocalized: {}
    },

    constructor: function(config) {
        let me = this;
        if (config) {
            me.cmp = config.cmp;
            me.pluginConfig = config;
            me.initConfig(config);
        }
        if(I18N && I18N.isReady){
            me.onLocalized();
        }
        Ext.on('i18nready', me.onLocalized, me);
    },

    onLocalized(){
        let me = this,
            type = me.type;
        if(type === 'gridrowdragdrop'){
            me.dragText =  I18N.get('DragText');
            let dragZone = me.dragZone;
            if(dragZone) dragZone.dragText = I18N.get('DragText');
            return;
        };
        if(type === 'listpaging'){
            me.setLoadMoreText(I18N.get('LoadMoreText'));
            me.setNoMoreRecordsText(I18N.get('NoMoreRecordsText'));
            me.syncState();
        }
    },

});
