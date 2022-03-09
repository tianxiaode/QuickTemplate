Ext.define('Common.shared.mixin.FormView', {
    extend: 'Ext.Mixin',

    formViewEventBind:{},

    /**
     * 
     * @param {表单视图的xtype}} xtype 
     * @param {表单视图的配置项} config 
     * @param {表单视图的保存事件名称} eventName 
     * @param {保存事件的回调函数}} callback 
     */
    getFormView(xtype,config, events){
        let me = this,
            entityName = me.entityName;
        xtype = xtype || `${entityName.toLowerCase()}editview`;
        config = Object.assign({}, config);
        //isGlobalView = isGlobalView || me.isPhone;
        let view = ViewMgr.getFormView(xtype,config);
        if(!view) Ext.raise('No dialog:' + xtype);
        if(events) me.bindViewEvents(me, xtype, view, events);
        return view;

    },

    bindViewEvents(me, xtype, view, events){
        if(!events) return;
        let eventBind = me.formViewEventBind;
        Object.keys(events).forEach(e=>{
            let key = `${xtype}.${e}`;
            if(eventBind[key]) return;
            view.on(e , events[e], me);
            eventBind[key] = true;
        });
    },

    /**
     * 
     * @param {是否需要模型值} needModelValue 
     * @param {配置对象}} config 
     */
    getFormViewConfig(config){
        let me = this,
            zIndex = me.getZIndex(), 
            defaultConfig = {            
                entityName:  me.entityName, 
                resourceName: me.resourceName,
                includeResource: true,
                permissionGroup: me.permissionGroup,
                permissionName: me.permissionName,
                backView: Ext.History.getToken(),
                zIndex: zIndex+1,
            };
        return Ext.apply(defaultConfig, config);
    },

    getZIndex(){
        let token = Ext.History.getToken();
        return token.includes('/') ? 3 : 2;
    }


});