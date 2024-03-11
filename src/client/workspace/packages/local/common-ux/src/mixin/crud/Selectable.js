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
            onListStoreBeforeLoad: 'doDeselectAll',
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
    onListSelect(sender, selected, eOpts ){},

        /**
     * 取消记录的选择     * 
     * @param {事件触发者} sender 
     * @param {选择的记录} records 
     * @param {事件选项} eOpts 
     */
    onListDeselect(sender, records, eOpts){},

    /**
     * 取消全部选择
     */
    doDeselectAll(){
        let list = this.getList();
        list && list.deselectAll();
    },
    
    getSelectable(){
        return this.getList().getSelectable();
    },

    getSelection(){
        return this.getSelections()[0];
    },

    getSelections(){
        return this.getSelectable().getSelectedRecords();
    },

    doDestroy(){
        Ext.destroy(this.listSelectListeners);
    }

    
})