Ext.define('Common.ux.crud.controller.mixin.View',{
    extend: 'Ext.Mixin',

    defaultViewXTypes:{
        create: '{entity}EditView',
        update: '{entity}EditView',
        detail: '{entity}DetailView',
        multilingual: '{entity}MultilingualView',
    },

    getViewXType(action){
        let me = this,
            defaults = me.defaultViewXTypes,
            xTypes = me.xTypes,
            xtype = (xTypes && xTypes[action]) || defaults[action];
        if(Ext.isEmpty(xtype)) Ext.raise(`No xtype ${action} `);
        return xtype.replace('{entity}', me.entityName);
    },

    getViewParams(record, events, config){
        let me = this,
            defaultConfig = {            
                entityName:  me.entityName, 
                resourceName: me.resourceName,
                includeResource: true,
                permissionGroup: me.permissionGroup,
                permissionName: me.permissionName,
                backView: Ext.History.getToken(),
                listeners:{scope: me},
            };
        Ext.iterate(events,(event,fn)=>{
            defaultConfig.listeners[event] = fn;
        })
        config =  Ext.apply(defaultConfig, config);
        return {
            record : record,
            type: me.isPhone ? ViewMgr.types.view : ViewMgr.types.dialog,
            config : config,
            defaultModelValue: me.getDefaultModelValue && me.getDefaultModelValue()
        }
    },

    onShowView(xtype, record , events,  config){
        let me = this,
            viewXtype= me.getViewXType(xtype);
        let params = me.getViewParams(record, events, config);
        ViewMgr.setParams(viewXtype, params);
        me.redirectTo(`${viewXtype}/${xtype}`);

    }




})
