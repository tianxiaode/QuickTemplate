Ext.define('Common.ux.crud.controller.mixin.Selectable',{
    extend: 'Common.ux.crud.controller.mixin.Base',

    detailViewXtype: null,

    initList(){
        let me = this,
            list = me.list;
        list.on('select', me.onViewSelect, me);
        list.on('deselect', me.onViewDeselect, me);
    },

        /**
     * 选择记录
     * @param {事件触发者} sender 
     * @param {选择的记录} selected 
     * @param {事件选项} eOpts 
     */    
    onViewSelect(sender, selected, eOpts ){
        let me = this;
        me.updateButtons();
    },

        /**
     * 取消记录的选择     * 
     * @param {事件触发者} sender 
     * @param {选择的记录} records 
     * @param {事件选项} eOpts 
     */
    onViewDeselect(sender, records, eOpts){
        let me = this;
        me.updateButtons();
    },

    getSelectable(){
        return this.list.getSelectable();
    },

    getSelections(){
        return this.getSelectable().getSelectedRecords();
    },

        /**
     * 取消全部选择
     */
    doDeselectAll(){
        this.getSelectable().deselectAll();
    },
    
    hasSelections(alert){
        let result = (this.getSelections() || []).length > 0;
        !result && alert && MsgBox.alert(null, I18N.get('NoSelection'));
        return result;
    },

    
})