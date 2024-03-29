Ext.define('Common.ux.app.CrudController',{
    extend: 'Common.ux.app.ViewController',
    alias: 'controller.uxcrudbasecontroller',

    mixins:[
        'Common.mixin.AjaxFailure',
        'Common.mixin.controller.ResourceAndPermissions',
        'Common.mixin.controller.CheckChange',
        'Common.mixin.controller.crud.Button',
        'Common.mixin.controller.crud.Batch',
        'Common.mixin.controller.crud.Crud',
        'Common.mixin.controller.crud.View',
        'Common.mixin.controller.crud.CountMessage',
        'Common.mixin.controller.crud.Multilingual',
        'Common.mixin.controller.crud.Selectable',
        'Common.mixin.controller.crud.ChildTap',
        'Common.mixin.controller.crud.ChildLongPress',
        'Common.mixin.controller.crud.DoubleTapToEdit',
        'Common.mixin.Searchable',
        'Common.mixin.InfoMenu'
    ],

    list: null , //列表对象

    init(){
        let me = this;
        me.isPhone = Ext.platformTags.phone;
        me.initList();
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


    initButtons(){},
    updateButtons(){},

    /**
     * 列表组件的存储发生改变是执行的操作
     * @param {列表组件} sender 
     * @param {存储} store 
     * @param {旧存储} oldStore 
     * @param {配置参数} eOpts 
     */
    onStoreChange(sender, store){
        let me = this,
            list = me.list,
            autoLoad = me.getView().autoLoad || list.autoLoad ;

        store.on('beforeload', me.onStoreBeforeLoad, me);
        store.on( 'load', me.onStoreLoad, me);

        (autoLoad === 'search') && me.doSearch();
        (autoLoad === true) &&  me.onRefreshStore();
        me.afterStoreChange && me.afterStoreChange(store, list);
    },



    getStore(name) {
        let vm = this.getViewModel();

        return (name && vm && vm.getStore('name')) 
            || this.list.getStore();
    },

    /**
     * 存储加载后的处理
     * @param {存储} store 
     * @param {记录} records 
     * @param {是否成功} successful 
     * @param {操作} operation 
     * @param {操作参数} eOpts 
     */
    onStoreLoad(store, records, successful, operation, eOpts){},


    /**
     * 存储加载前的操作
     */
    onStoreBeforeLoad(store){
        if(Ext.isEmpty(store.getProxy().getUrl())) return false;
        this.doDeselectAll();
        return true;
    },

    /**
     * 刷新列表
     */
    onRefreshStore(){
        this.getStore().loadPage(1);
    },

    doDestroy(){
        this.destroyMembers('list');
        this.callParent();
    }

})