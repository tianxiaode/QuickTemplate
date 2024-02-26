Ext.define('Common.mixin.crud.Selectable',{
    extend: 'Common.mixin.Listener',

    requires:[
        'Common.mixin.crud.Button'
    ],


    mixinConfig: {
        configs:true,
        before:{
            doDestroy: 'doDestroy'
        },
        after:{
            onStoreBeforeLoad: 'doDeselectAll'
        }
    },

    config:{
        selectEventListeners: ['select', 'deselect']
    },

    listSelectListeners: null,

    updateSelectEventListeners(events){
        this.addEventListeners(this.getList(), events, 'list', 'listSelectListeners');
    },

        /**
     * 选择记录
     * @param {事件触发者} sender 
     * @param {选择的记录} selected 
     * @param {事件选项} eOpts 
     */    
    onListSelect(sender, selected, eOpts ){
        let me = this;
        Logger.debug(this.onListSelect, selected)
        me.refreshButtons(me.hasSelection(false));
        me.afterListSelect && me.afterListSelect(selected);
    },

        /**
     * 取消记录的选择     * 
     * @param {事件触发者} sender 
     * @param {选择的记录} records 
     * @param {事件选项} eOpts 
     */
    onListDeselect(sender, records, eOpts){
        let me = this;
        me.refreshButtons(me.hasSelection(false));
        me.afterListDeselect && me.afterListDeselect(records);
    },

    /**
     * 取消全部选择
     */
    doDeselectAll(){
        let list = this.getList();
        list && list.deselectAll();
    },
    
    hasSelection(alert){
        let result = this.getList().hasSelection();
        !result && alert && MsgBox.alert(null, I18N.get('NoSelection'));
        return result;
    },

    getSelectable(){
        return this.getList().getSelectable();
    },

    getSelections(){
        return this.getSelectable().getSelectedRecords();
    },

    doDestroy(){
        Ext.destroy(this.listSelectListeners);
    }

    
})