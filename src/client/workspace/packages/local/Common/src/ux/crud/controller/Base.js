Ext.define('Common.ux.crud.controller.Base',{
    extend: 'Ext.app.ViewController',
    alias: 'controller.uxcrudbasecontroller',

    mixins:[
        'Common.mixin.Searchable',
        'Common.mixin.Menuable',
    ],

    messageTemplate: null , //信息模板
    entityName: null, //实体
    resourceName: null, //资源
    currentList: null, //当前列表对象
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
    crudButtons: null,  //所有crud按钮
    searchFields: null, //所有查询字段
    updateViewXtype: null,
    createViewXtype: null,
    selections:[],

    init(){
        let me = this;
        me.isPhone = Ext.platformTags.phone;
        me.initList(me);
        me.initBaseProperties(me);
    },

    /**
     * 获取Crud的操作对象
     */
     initList(me){
        let view = me.getView(),
            list = (view.isCrudList && view) || view.down('[isCrudList]');
        if(!list) Ext.raise('List is not defined.')
        list.on('storechange', me.onStoreChange, me);

        list.on('select', me.onViewSelect, me);
        list.on('deselect', me.onViewDeselect, me);

        list.doubleTapToEdit && list.on('childdoubletap', me.onChildDoubleTap, me);
        list.childTap && list.on('childtap', me.onListChildTap, me);
        list.childLongPress && list.on('childlongpress', me.onListChildLongPress, me);

        me.list = list;
        me.currentList = list;
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


    onListChildTap:Ext.emptyFn,
    onListChildLongPress:Ext.emptyFn,
    
    /**
     * 获取视图模型指定键的值
     * @param {键} key 
     */
    getViewModelValue(key){
        let vm = this.getViewModel();
        return vm.get && vm.get(key);
    },

    /**
     * 从视图模型获取指定键的值
     * @param {键} key 
     * @param {值} value 
     */
    setViewModelValue(key, value){
        let vm = this.getViewModel();
        vm && vm.set(key, value);
    },

    /**
     * 验证权限
     * @param {权限} permission 
     */
    isGranted(permission){
        let me = this,
            entityName = me.entityName,
            group = `${me.permissionGroup || entityName}.${ me.permissionName || Format.pluralize(entityName) }`;
        return ACL.isGranted(`${group}.${Ext.String.capitalize(permission)}`);
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
        return this.currentList.getStore();
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
     * 选择记录
     * @param {事件触发者} sender 
     * @param {选择的记录} selected 
     * @param {事件选项} eOpts 
     */    
    onViewSelect(sender, selected, eOpts ){
        let me = this;
        me.selections = me.currentList.getSelectable().getSelectedRecords();        
        me.updateCrudButtonState();
    },

        /**
     * 取消记录的选择     * 
     * @param {事件触发者} sender 
     * @param {选择的记录} records 
     * @param {事件选项} eOpts 
     */
    onViewDeselect(sender, records, eOpts){
        let me = this;
        me.selections = me.currentList.getSelectable().getSelectedRecords();        
        me.updateCrudButtonState();
    },

    /**
     * 取消全部选择
     */
    doDeselectAll(){
        let me = this,
            list = me.currentList,
            selectable = list.getSelectable();
        selectable.deselectAll();
        me.selections = [];
    },
    

    /**
     * 获取Crud按钮
     */
    getCrudButtons(){
        let me = this,
            view = me.getView(),
            crudButtons = me.crudButtons;
        if(crudButtons) return crudButtons;
        let buttons = view.query('[isCrud]');
        crudButtons = {};
        buttons.forEach(f=>{
            crudButtons[f.crudName] = f;
        });
        me.crudButtons = crudButtons;
        return crudButtons;
    },

    /**
     * 获取按钮
     * @param {按钮的key} key 
     */
    getCrudButton(key){
        let buttons  = this.getCrudButtons();
        return buttons[key];
    },

    /**
     * 禁用/启用按钮
     * @param {按钮的key} key 
     * @param {是否禁用} isDisabled
     * @param {状态值} state 
     */
    setCrudButton(key,isDisabled, state){
        let button = this.getCrudButton(key) ;
        button && isDisabled && button.setDisabled(state);
        button && !isDisabled && button.setHidden(state);
    },

    /**
     * 更新CRUD按钮状态
     */
    updateCrudButtonState(){
        let me = this,            
            selections = me.selections,
            hasSelected = selections.length > 0,
            allowUpdate = hasSelected ,
            allowDelete = hasSelected ;        
        if(me.allowUpdate) allowUpdate = allowUpdate && me.allowUpdate(selections);
        if(me.allowDelete) allowDelete = allowDelete && me.allowDelete(selections);
        me.setCrudButton('update', true, !allowUpdate);
        me.setCrudButton('delete', true, !allowDelete);
        me.customCrudButtonState(me, hasSelected, allowUpdate, allowDelete);
    },

    /**
     * 初始化CRUD按钮的显示
     */
     initCrudButtonHiddenState(){
        let me = this,
            permissions = me.permissions;
        me.setCrudButton('create', false, !me.isGranted(permissions.create));
        me.setCrudButton('update', false, !me.isGranted(permissions.update));
        me.setCrudButton('delete', false, !me.isGranted(permissions.delete));
    },

    customCrudButtonState: Ext.emptyFn,

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

    /**
     * 删除实体
     */
    onDelete(){
        let me = this;
        me.doMultiEntityAction(
            I18N.get('DeleteConfirmMessageTitle'),
            I18N.get('DeleteConfirmMessage'),
            me.deleteAction,
            me.getDeleteData || me.defaultGetDataFn);

    },

    deleteAction(data){
        return Http.delete(URI.crud(this.entityName), data.ids);
    },


    /**
     * 获取多实体远程操作数据
     * @param {获取提交数据的函数} getDataFn
     */
    getMultiEntityActionData(getDataFn){
        let me = this,
            store = me.currentList.getStore(),
            messageField = store.messageField,
            selections = me.selections,
            data = { ids: [], contents: [] };
        getDataFn = getDataFn || me.defaultGetDataFn;
        //组织数据
        selections.forEach(r=>{
            me.getMultiEntityActionContent(data, r, messageField);
            getDataFn.apply(me, [data, r]);

        });
        return data;
    },

    getMultiEntityActionContent(data, record,messageField){
        let msg = Format.getTranslationText(record.get(messageField), record.get('translation'), messageField) ;
        data.contents.push(msg);
    },

    defaultGetDataFn(data, record){
        data.ids.push(record.getId());
    },

    hasSelections(){
        let result = this.selections.length >0;
        !result && MsgBox.alert(null, I18N.get('NoSelection'));
        return result;
    },

    /**
     * 执行多个实体的远程操作
     * @param {确认窗口标题} confirmTitle 
     * @param {确认信心} confirmMessage 
     * @param {要执行的操作} action 
     * @param {信息内容} contents 
     */
    doMultiEntityAction(confirmTitle, confirmMessage, action, getDataFn, successFn, failureFn){
        let me = this;

        //如果没有选择，显示提示
        if(!me.hasSelections()) return;

        let data = me.getMultiEntityActionData(getDataFn);


        //确认后执行操作
        MsgBox.confirm(
            confirmTitle,
        	Format.format(confirmMessage, me.getMessageTpl().apply(data.contents)),
            function (btn) {
                if (btn !== "yes") return;
                action.apply(me,[data])
                .then(
                    successFn || me.doMultiEntityActionSuccess, 
                    failureFn || me.onAjaxFailure, 
                    null, me);
            },
            me
        );

    },

    /**
     * 获取信息模板
     */
    getMessageTpl(){
        var me = this,
            template = me.messageTemplate;
        if(template) return template;
        template = me.messageTemplate = Template.getTpl('messageList');
        return template;
    },

    /**
     * 执行多实体远程操作成功的回调函数
     * @param {响应} response 
     * @param {远程调用参数}} opts 
     */
    doMultiEntityActionSuccess(response, opts){
        let me = this,
            store = me.getStore(),
            msgFieldName = store.messageField,
            isDelete = response.request.method === 'DELETE',
            resultMsg = isDelete ? I18N.get("DeleteSuccess") : I18N.get('UpdateSuccess'),
            obj = Http.parseResponse(response), 
            msg = ['<ul class="message-tips">'],
            items = obj && obj.items;
        Ext.Viewport.unmask();
        if(!items){
            me.onRefreshStore();
            Toast(resultMsg,null,null, 3000);
            return;
        }
        items.forEach(m=>{
            let text = Ext.isObject(m) ? m[msgFieldName] || m.name || m.displayName : m;
            text = Format.getTranslationText(text, m.translation, msgFieldName);
            msg.push(`<li class="success">${text}:  ${resultMsg}</li>`);
        })
        msg.push('</ul>');
        if(isDelete && store.isTreeStore){
            let selection = me.getCurrentSelections()[0];
            if(selection){
                me.currentList.getSelectable().select(selection.parentNode);
            }
        }
        me.onRefreshStore();
        Toast(msg.join(''),null,null, 3000);

    },

    /**
     * check列发生改变
     * @param {列} column 
     * @param {行号} rowIndex 
     * @param {已选/未选} checked 
     * @param {记录} record 
     * @param {事件} e 
     * @param {事件选项} eOpts 
     */
     onColumnCheckChange(column, rowIndex, checked, record, e, eOpts) {
        var me = this;
        if(!me.isGranted(me.permissions.update)) return;
        me.doColumnCheckChange(record, column.dataIndex, checked);
    },

    /**
     * 执行复选框列的更新操作
     * @param {提交地址} url 
     * @param {记录} record 
     * @param {要更改的字段} field 
     */
    doColumnCheckChange(record, field, checked) {
        let me = this,
            store = me.currentList.getStore(),
            updateAction = store.updateAction,
            checkAction = store.checkAction,
            uncheckAction = store.uncheckAction,
            entityName = me.entityName,
            id = record.getId(),
            data = me.getColumnCheckChangeData && me.getColumnCheckChangeData(),
            url;
        if(updateAction){
            url = URI.crud(entityName,id, updateAction[field], checked);
        }else{
            action = checked ? checkAction[field] : uncheckAction[field];
            url = URI.crud(entityName,id, action);
        }
        Http.patch(url,data).then(me.onColumnCheckChangeSuccess, me.onColumnCheckChangeFailure, null, me);
    },

    /**
     * 更新成功
     */
    onColumnCheckChangeSuccess(){
        this.currentList.getStore().commitChanges();
        Toast(I18N.get('UpdateSuccess'));
    },

    /**
     * 更新失败
     */
    onColumnCheckChangeFailure(response){
        this.currentList.getStore().rejectChanges();
        this.onAjaxFailure(response);
    },



    /**
     * 在执行新建之前的操作，返回false可阻止对话框显示
     * @param {对话框} dialog 
     */
    beforeCreate(){
        return true;
    },

    onCreate(){
        let me = this,
            viewXtype= me.getCreateOrUpdateXtype();

        if(!me.beforeCreate()) return;
        let params = me.getViewParams(null, me.getCreateOrUpdateViewEvents());
        ViewMgr.setParams(viewXtype, params);
        me.redirectTo(`${viewXtype}/add`);
    },



    onUpdate(){
        let me = this,
            selection = me.selections[0];
        
        if(!me.beforeUpdate(selection)) return;

        if(selection.parentNode){
            selection.set('parentName', selection.parentNode.get('displayName'));
            selection.commit();
        }
        me.doUpdate(selection);
    },

    /**
     * 在执行更新之前的操作，返回false可阻止对话框显示
     * 默认会检测是否有当前记录
     * @param {对话框} dialog 
     * @param {要编辑的记录} selection 
     */
     beforeUpdate(selection){
        if(selection) return true;
        let entityName = this.entityName;
        MsgBox.alert(null, Format.format(
            I18N.get('NoSelection'), 
            I18N.get(entityName, me.resourceName), 
            I18N.get('Edit')));
        return false;
    },


    doUpdate(selection){
        let me = this,
            viewXtype= me.getCreateOrUpdateXtype(true);
        let params = me.getViewParams(null, me.getCreateOrUpdateViewEvents(), selection);
        ViewMgr.setParams(viewXtype, params);
        me.redirectTo(`${viewXtype}/edit`);
    },

    getCreateOrUpdateXtype(isUpdate){
        let me = this,
            xtype = isUpdate ? me.updateViewXtype : me.createViewXtype;
        return xtype || `${me.entityName}EditView`;
    },

    getViewParams(config, events, record){
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
            defaultModelValue: me.getDefaultModelValue()
        }
    },

    getCreateOrUpdateViewEvents(){
        return {
            saved: this.onCreateOrUpdateViewSaved,
            canceledit: this.onCreateOrUpdateCancelEdit
        }
    },

    /**
     * 新建或更新视图后的操作
     * @param {对话框} dialog 
     * @param {是否保存成功} isSavedSuccess 
     * @param {是否保存了新记录} hasNewInSaved 
     */
    onCreateOrUpdateCancelEdit(sender, hasNew){
        if(hasNew){
            this.onRefreshStore();
        }
    },

    /**
     * 新增记录后操作
     * @param {编辑视图}} sender 
     * @param {后续操作} action 
     * @param {新增的记录} record 
     */
    onCreateOrUpdateViewSaved(sender, action, after , record){
        this.onRefreshStore();
    },


    onChildDoubleTap(){
        let me = this,
            updateButton = me.getCrudButton('update');
        if(updateButton.getDisabled()) return;
        me.onUpdate();
    },



    getDefaultModelValue: Ext.emptyFn,

    onAjaxFailure(response){    
        let error = Http.getError(response, this.resourceName);
        MsgBox.alert(null,error);
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
        me.currentList = null;
        me.crudButtons = null;
        me.searchFields = null;

        me.callParent();
    }

})