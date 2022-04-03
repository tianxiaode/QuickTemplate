Ext.define('Common.ux.crud.controller.Base',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.uxcrudbasecontroller',

    mixins:[
        'Common.ux.crud.controller.mixin.Ajax',
        'Common.ux.crud.controller.mixin.ViewModel',
        'Common.ux.crud.controller.mixin.Button',
        'Common.ux.crud.controller.mixin.Column',
        'Common.ux.crud.controller.mixin.MultiEntityAction',
        'Common.ux.crud.controller.mixin.Crud',
        'Common.mixin.Searchable',
        'Common.mixin.Menuable',        
        'Common.ux.crud.controller.mixin.Selectable',
        'Common.ux.crud.controller.mixin.ChildTap',
        'Common.ux.crud.controller.mixin.ChildLongPress',
        'Common.ux.crud.controller.mixin.DoubleTapToEdit',
    ],

    entityName: null, //实体
    resourceName: null, //资源
    list: null , //列表对象
    isPhone: false, //是否手机平台
    permissionGroup: null, //权限组
    permissionName: null, //权限名
    searchTask : null,   //查询延迟任务
    msgFieldName: null, //提示信息字段名称
    permissions:{
        create: 'Create',
        update: 'Update',
        delete: 'Delete'
    },
    isInitialSearchItemEvent: false,
    searchFields: null, //所有查询字段
    updateViewXtype: null,
    createViewXtype: null,

    init(){
        let me = this;
        me.isPhone = Ext.platformTags.phone;
        me.initList();
        me.initBaseProperties(me);
    },

    /**
     * 获取Crud的操作对象
     */
    initList(){
        let me = this,
            view = me.getView(),
            list = (view.isCrudList && view) || view.down('[isCrudList]');
        if(!list) Ext.raise('List is not defined.');

        me.list = list;
        list.on('storechange', me.onStoreChange, me);
    },

    initBaseProperties(me){
        let names = ['entityName', 'resourceName', 'permissionGroup', 'permissionName'],
            view = me.getView();
        names.forEach(n=>{
            let value = me[n];
            if(!Ext.isEmpty(value)) return;
            value = me.getViewModelValue(n)  || me.list[n]  || view[n];
            if(Ext.isEmpty(value) && n === 'permissionName') value = Format.pluralize(me.entityName);
            if(Ext.isEmpty(value)) Ext.raise(`No ${n}`);
            me[n] = Format.capitalize(value);    
        })
    },


    /**
     * 列表组件的存储发生改变是执行的操作
     * @param {列表组件} sender 
     * @param {存储} store 
     * @param {旧存储} oldStore 
     * @param {配置参数} eOpts 
     */
    onStoreChange(sender, store, oldStore, eOpts){
        let me = this,
            list = me.list,
            autoLoad = me.getView().autoLoad || list.autoLoad ;

        store.on('beforeload', me.onStoreBeforeLoad, me);
        store.on( 'load', me.onStoreLoad, me);

        me.initialSearchItemEvent(me);

        me.setSortMenu(store, list);

        me.initCrudButtonHiddenState();

        (autoLoad === 'search') && me.doSearch();
        (autoLoad === true) &&  me.onRefreshStore();
        me.onAfterStoreChange && me.onAfterStoreChange(store, list);
    },


    setSortMenu(store, list){
        let me = this,            
            view = me.getView(),
            moreButton = view.getMoreButton && view.getMoreButton();
        if(!moreButton) return;
        let menu = moreButton.getMenu(),
            sorter = store.getSorters().items[0];
        if(!sorter) return;
        let value = `${sorter._property}-${sorter._direction}`;
        this.currentSortField = value;
        let menuItem = menu.down(`menuitem[value=${value}]`);
        if(menuItem) menuItem.setChecked(true, true);
    },

    getStore(){
        return this.list.getStore();
    },

    /**
     * 存储加载后的处理
     * @param {存储} store 
     * @param {记录} records 
     * @param {是否成功} successful 
     * @param {操作} operation 
     * @param {操作参数} eOpts 
     */
     onStoreLoad(store, records, successful, operation, eOpts){
        let me = this,
            view = me.getView(),  
            countMessage = view.getCountMessage && view.getCountMessage();
        countMessage && countMessage.setCount(store.getTotalCount());

        me.afterStoreLoad(me, store, records);
    },

    afterStoreLoad: Ext.emptyFn,

    /**
     * 存储加载前的操作
     */
    onStoreBeforeLoad(){
        this.doDeselectAll();
        this.selections = [];
        return true;
    },

    /**
     * 刷新列表
     */
    onRefreshStore(){
        let me = this;
        if(!Enums.isReady) {
            Enums.on('ready', me.onRefreshStore, me, {single: true});
            return;
        };
        let store = me.getStore();
        store.loadPage(1);
    },

    onBack(){
        let me = this,
            backView = me.backView || Ext.route.Router.application.getDefaultToken();
        me.redirectTo(backView);
    },

    destroy(){
        let me = this;
        me.selections = null;
        me.list = null;
        me.crudButtons = null;
        me.searchFields = null;

        me.callParent();
    }

})