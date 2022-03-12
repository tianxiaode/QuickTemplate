Ext.define('Common.mixin.DesktopCrudController',{
    mixinId: 'uxdesktopcrudcontroller',


    mixinConfig: {
        after:{
            onStoreLoad: 'onStoreLoad',
        }
    },

    onStoreLoad(store, records, successful, operation, eOpts){
        let me = this,  
            countMessage = me.getCrudButton('countmessage');
        if(countMessage){
            countMessage.setHtml(I18N.get('CountMessage').replace('{0}', store.getTotalCount()));
        }
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
        me.doColumnCheckChange(record, column.dataIndex);
    },


    // onContextMenu: function (e) {
    //     let me = this,
    //         grid = me.getView(),
    //         target = e.getTarget(grid.itemSelector),
    //         item;

    //     if (target) {
    //         e.stopEvent();

    //         item = Ext.getCmp(target.id);
    //         if (item) {
    //             me.updateMenu(item.getRecord(), item.el, e, 't-b?');
    //         }
    //     }
    // },    

    onMenu(sender, context) {
        let me = this,
            view=  me.getView(),
            config = Object.assign({  ownerCmp: view}, me.getFormViewConfig()),
            menu = ViewMgr.getMenu(context.tool.menuXtype,config);
        menu.setRecord(context.record);
        menu.autoFocus = !context.event.pointerType;
        menu.showBy(context.tool.el,  'r-l?');
    },    

})