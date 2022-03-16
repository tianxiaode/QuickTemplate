Ext.define('Common.mixin.Menuable', {
    extend: 'Ext.Mixin',

    onShowInfoMenu(xtype, location, cfg, fn){
        if(!location) return;
        return this.doShowInfoMenu(xtype, location.record, location.sourceElement, cfg, fn)
    },

    doShowInfoMenu(xtype, record, el, cfg, fn){
        let me = this;
        if(!record || !el) return;
        let params = me.getViewParams(cfg,null, record),
            menu = ViewMgr.getMenu(xtype,params.config);
        menu.setRecord(record);
        menu.showBy(el,  'r-l?');
        return menu;

    }

});