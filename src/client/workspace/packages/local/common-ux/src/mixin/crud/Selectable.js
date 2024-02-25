Ext.define('Common.mixin.crud.Selectable',{
    extend: 'Common.mixin.crud.Base',

    listSelectListeners: null,

    initSelectable(){
        let me = this,
            list = me.getList();
        me.listSelectListeners= list.on({
            destroyable: true,
            scope: me,
            select: me.onListSelect,
            deselect: me.onListDeSelect
        })
    },

        /**
     * 选择记录
     * @param {事件触发者} sender 
     * @param {选择的记录} selected 
     * @param {事件选项} eOpts 
     */    
    onListSelect(sender, selected, eOpts ){
        let me = this;
        me.refresButtons(true);
        me.afterListSelect && me.afterListSelect(selected);
    },

        /**
     * 取消记录的选择     * 
     * @param {事件触发者} sender 
     * @param {选择的记录} records 
     * @param {事件选项} eOpts 
     */
    onListDeSelect(sender, records, eOpts){
        let me = this;
        me.refresButtons(me.hasSelection(true));
        me.afterListDeselect && me.afterListDeselect(selected);
    },

    /**
     * 取消全部选择
     */
    doDeselectAll(){
        this.getList().deselectAll();
    },
    
    hasSelection(alert){
        let result = this.getlist().hasSelection();
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