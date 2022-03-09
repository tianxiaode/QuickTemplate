Ext.define('Common.phone.app.CrudController',{
    extend: 'Common.shared.app.CrudController',
    alias: 'controller.commonphone-basecrud',

    requires:[
        'Common.shared.ux.menu.PopMenu',
    ],

    popMenuXtype: 'uxpopmenu',

    onStoreLoad(store, records, successful, operation, eOpts){
        let me = this;
        me.callParent(arguments);
        if(me.currentListMode === 'select') me.onMultiSelect();
    },

    onBack(){
        let me = this,
            backView = me.backView || Ext.route.Router.application.getDefaultToken();
        me.redirectTo(backView);
    },

    onDone(){
        return;
    },


 
    onShowContentMenu(record,target){
        let me = this,
            menu = me.getContentMenu();
        if(!menu) return;
        let rect = target.getBoundingClientRect(),
            itemCount = menu.getItems().items.length,
            maxHeight = 34+ itemCount*48;
            viewSize = Ext.Viewport.getSize(),
            x = rect.left - 194,
            y = rect.bottom;
        if(viewSize.height - y < maxHeight) y = rect.top - maxHeight;
        me.currentPressRecord = record;
        menu.showAt(x, y);       
    },

    onSort(sender){
        let me = this,
            value = sender.getValue();
        if(me.currentSortField === value) return;
        me.currentSortField = value;
        let index =  value.indexOf('-'),
            field = value.substr(0,index),
            dir = value.substr(index+1),
            store = me.currentList.getStore();
        store.sort(field, dir);
    },

    onSelectAll(sender){
        let me = this,
            toolName = 'check',
            store = me.currentList.getStore(),
            selectAll = sender.getIconCls().includes('blank');
        if(selectAll){
            sender.setIconCls(me.checkCls);
            store.each((r,index)=>{
                let tool = me.getItemTool(index, toolName);
                if(!tool) return;
                tool.setIconCls(me.checkCls);
                me.phoneSelections.add(r);
            });
        }else{
            sender.setIconCls(me.uncheckCls);
            store.each((r,index)=>{
                let tool = me.getItemTool(index, toolName);
                if(!tool) return;
                tool.setIconCls(me.uncheckCls);
                me.phoneSelections.add(r);
            });
            me.phoneSelections.clear();
        }
        me.setSelectToolbarDeleteDisabled();
    },

    // onSwitchSelectMode(sender){
    //     this.currentList.getSelectable().setMode(sender.getValue());
    // },

    onListChildTap(sender, location, eOpts){
        let me = this,
            record = location.record;
        if(!record) return;
        let target = location.sourceElement;
        if(!target) return;
        let classList = target.classList.value;

        if(classList.includes('fa-edit')){
            me.doUpdate(record);
            return;
        }

        if(me.doListChildTap) me.doListChildTap(me, record, target, classList);
    },


    onListChildLongPress(sender, location, eOpts){
        let me = this,
            view = me.getView(),
            record = location.record;
        if(!Ext.isEmpty(me.currentListMode)) return;
        if(!record) return;
        me.phoneSelections.clear();
        me.phoneSelections.add(record);
        if(me.popMenuXtype){
            let menu = me.popMenu;
            if(!menu){
                menu = me.popMenu = ViewMgr.getMenu(me.popMenuXtype, me.getFormViewConfig({
                    hasMultiSelect: view.hasMultiSelect,
                    hasCopy: view.hasCopyToolbar,
                    buttonHandlerScope: me
                }));    
            }
            // me.bindViewEvents(me,me.popMenuXtype, menu, {
            //     itemtap: me.onPopMenuItemTap
            // });
            menu.showBy(location.source.currentTarget)

        }
        //if(menu) menu.showBy(location.source.currentTarget);
        //if(Ext.isEmpty(classList)) return;
        //if(me.doListChildLongPress) me.doListChildLongPress(me, record, target, classList);
    },

    currentListMode: null,
    onMultiSelect(sender){
        let me = this,
            view = me.getView(),
            toolbar = view.getSelectToolbar();
        me.hidePopMenu();
        toolbar.setHidden(false);
        me.currentListMode = toolbar.mode;
        me.setSelectToolbarSelectAllState();
        me.changeListItemToolHiddenState(false, 'check');
    },

    onListToolbarHiddenChange( sender, value, oldValue, eOpts ){
        if(!value) return;
        let me = this;
        //工具栏隐藏，将工作模式设置回正常模式
        me.currentListMode = null;
        //隐藏tool
        me.changeListItemToolHiddenState(true, sender.mode === 'copy' ? 'paste' : 'check');
    },

    changeListItemToolHiddenState(state, toolName){
        let me = this,
            list = me.currentList,
            store = list.getStore();
        store.each((r, index)=>{
            let tool = me.getItemTool(index, toolName);
            if(!tool) return;
            tool.setHidden(state);
            if(!state && toolName === 'check' && me.phoneSelections.has(r)){
                tool.setIconCls(me.checkCls);
            }
        });            
    },

    getItemTool(index, toolName){
        let me = this,
            list = me.currentList,
            start = list.hasPullRefresh ? 1 : 0;
        let item = list.getItemAt(index + start);
        if(!item) return null;
        let tools = item.getTools();
        if(!Ext.isArray(tools)) return null;
        let tool = tools.find(m=>m.getItemId() === toolName);
        return tool;
    },

    onCopy(sender){
        let me = this,
            view = me.getView(),
            toolbar = view.getCopyToolbar();
        me.hidePopMenu();
        toolbar.setHidden(false);
        me.currentListMode = toolbar.mode;
        me.changeListItemToolHiddenState(false, 'paste');
    },

    hidePopMenu(){
        let me = this,
            menu = me.popMenu;
        if(menu) menu.hide();
        Ext.defer(Ext.emptyFn,50);
    },

    setSelectToolbarDeleteDisabled(){
        let me = this;
        me.getView().getSelectToolbar().getDelete().setDisabled(me.phoneSelections.size === 0);
    },

    setSelectToolbarSelectAllState(){
        let me = this,
            count = me.currentList.getStore().getCount();
        me.getView().getSelectToolbar().getSelectAll()
            .setIconCls(count === me.phoneSelections.size ? me.checkCls : me.uncheckCls);
        me.setSelectToolbarDeleteDisabled();
    },

    onListItemSelect(sender, location){
        let me = this,
            tool = location.tool,
            record = location.record,
            check = tool.getIconCls().includes('blank');
        tool.setIconCls(check ? Format.checkCls : Format.uncheckCls);
        if(check){
            me.phoneSelections.add(record);
        }else{
            me.phoneSelections.delete(record);
        }
        me.setSelectToolbarSelectAllState();        

    },

    onListItemPaste: Ext.emptyFn


});
 