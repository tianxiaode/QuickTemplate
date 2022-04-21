Ext.define('Common.mixin.InfoMenu', {
    extend: 'Ext.Mixin',

    onShowInfoMenu(xtype, record, el, cfg, callback){
        let me = this;
        if(!record || !el) return;
        let params = me.getViewParams(record,null, cfg),
            menu = ViewMgr.getMenu(xtype,params.config, true);

        menu.entityName = params.entityName;
        menu.resourceName = params.resourceName;
        menu.permissionGroup = params.permissionGroup;
        menu.permissionName = params.permissionName;
        menu.setRecord(record);
        menu.showBy(el,  'r-l?');
        if(callback) menu.callback = callback;
        return menu;

    }

});