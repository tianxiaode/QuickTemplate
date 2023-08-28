/**
 * @class Common.util.ViewManager
 * 
 * @singleton
 * 
 * 视图管理类
 */
Ext.define('Common.service.ViewManager', {
    alternateClassName: 'ViewMgr',
    singleton: true,

    views:{},
    viewParams:{},
    homeViewXtype: 'homeview',

    pages:{
        page404: 'page404',
    },

    /**
     * @property {Object} types
     * 视图类型
     */
    types:{
        view: 'VIEW',
        menu: 'MENU',
        dialog: 'DIALOG'
    },

    /**
     * @property {Object} defaultConfig
     * 视图默认配置
     */

    defaultConfig:{
        desktop:{
            modal:true,
            closable:true,
            closeAction: 'onHide',
            hideMode: 'display',
            floated: true,
            centered: true,
            border: true,
            bodyBorder: false,
            shadow: true,
            buttonsAlign: 'right',    
            focusable: false,
            tabIndex: -1,
        
        
            headerCls: Ext.baseCSSPrefix + 'dialogheader',
            titleCls: Ext.baseCSSPrefix + 'dialogtitle',
            toolCls: [
                Ext.baseCSSPrefix + 'paneltool',
                Ext.baseCSSPrefix + 'dialogtool'
            ],
        
        
            classCls: Ext.baseCSSPrefix + 'dialog', 
        
    
        },
        phone:{
            ui: 'dark',
            width: '100%',
            height: '100%',
            minWidth: '100%',
            maxHeight: '100%',
            resizable: null,
            collapsible:null
        },
        menu:{
            minWidth: 300,
            minHeight: 400,
            maxHeight: 600,
            maxWidth: 600,
            scrollable: true,
            anchor: true,
            // bodyPadding: 10,  
            //title: Ext.emptyString  ,
            // headerCls: Ext.baseCSSPrefix + 'dialogheader',
            // titleCls: Ext.baseCSSPrefix + 'dialogtitle',
            // toolCls: [
            //     Ext.baseCSSPrefix + 'paneltool',
            //     Ext.baseCSSPrefix + 'dialogtool'
            // ], 
            defaultListenerScope: true,
            ui: 'info'
        }
    },

    constructor(config){
        let me = this;
        Ext.iterate(me.types, (key, value)=>{
            me.views[value] = {};
        });
    },

    /**
     * @method getView
     * 获取视图实例
     * @param {*} xtype 
     * @param {*} type 
     * @param {*} config 
     * @param {*} defaultConfig 
     * @returns 
     */
    getView(xtype, type, config, hasDefault){
        let me = ViewMgr;
        xtype = me.getXtype(xtype);
        let instances = me.views[type],
            instance = instances[xtype] || null;
        if(instance) return instance;
        config = Ext.apply({xtype: xtype}, config);
        if(hasDefault)  {
            config = Ext.apply(config, Ext.platformTags.phone ? me.defaultConfig.phone : me.defaultConfig.desktop);
        }
        instance = Ext.create(config);
        instances[xtype] = instance;
        return instance;
    },

    getXtype(xtype){
        if(Ext.isEmpty(xtype)) return null;
        if(Ext.isObject(xtype)) return xtype.prototype.xtype;
        let cls = ViewMgr.getWidget(xtype);
        if(!cls) {
            return null;
        }
        return cls.prototype.xtype;
    },

    getWidget(xtype){
        if(Ext.isEmpty(xtype)) return null;
        let appName = ViewMgr.getAppName().toLowerCase(),
            plat = Ext.platformTags.desktop ? 'desktop' : 'phone';
        xtype = xtype.toLowerCase();
        let widget = Ext.ClassManager.getByAlias(`widget.common-${xtype}`) 
            || Ext.ClassManager.getByAlias(`widget.${plat}-${xtype}`)
            || Ext.ClassManager.getByAlias(`widget.${appName}-${xtype}`)
            || Ext.ClassManager.getByAlias(`widget.${xtype}`);
        return widget;
    },

    getAppName(){
        return Ext.getApplication().getName();
    },    

    getParams(xtype){
        let me = ViewMgr;
        xtype = me.getXtype(xtype);
        return me.viewParams[xtype] || {};
    },

    setParams(xtype, params){
        let me = ViewMgr;
        xtype = me.getXtype(xtype);        
        if(Ext.isEmpty(xtype)) return;
        me.viewParams[xtype.toLowerCase()] = params;
    },

    /**
     * @method showView
     * 显示视图
     * @param {string} xtype 视图的xtype
     * @param {string} type 视图类型
     * @param {config} config 视图配置项
     * @param {boolean} hasDefault 是否使用默认配置
     * @param {container} 视图容器
     * 
     * @returns 无
     */
    showView(xtype, type, config, hasDefault, container){
        let me = ViewMgr,
            view = me.getView(xtype, type, config, hasDefault);
        if(!container){            
            view.show();
            return view;
        }
        if(!container.down(xtype)) container.add(view);
        container.setActiveItem(view);
        return view;
    },

    /**
     * @method showPages
     * 显示404、登录等页面
     * @param {string} xtype 视图xtype
     */
    showPage(xtype){
        let me = ViewMgr;
        me.showView(xtype, me.types.view, null,false, Ext.Viewport);
    },

    getMenu(xtype, config ,hasDefault){
        let me = ViewMgr;
        if(hasDefault){
            config = Ext.apply(config, me.defaultConfig.menu);
        }
        let menu = me.getView(xtype, me.types.menu, config);
        return menu;
    },

    getDialog(xtype, config){
        return ViewMgr.getView(xtype, ViewMgr.types.dialog, config, false);

    },


    doDestroy(){
        let me = ViewMgr;
        for(let key in me.views){
            Ext.clear(me.views[key]);
        }
    },


});
