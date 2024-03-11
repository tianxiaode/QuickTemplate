Ext.define('Common.mixin.crud.ToolAction', {
    extend: 'Common.mixin.Component',

    toolTapEventListener: null,

    initialize(){
        let me = this;
        me.toolTapEventListener = me.getList().on('tooltap', me.onToolTap, me);
    },

    onToolTap(grid, context){
        let me = this,
            cls = context.tool.getIconCls(),
            record = context.record;
        Logger.debug(me.onToolTap, cls, context);
        me.currentRecord = record;
        if(cls.includes(IconCls.language)){
            Logger.debug(this.onToolTap, "多语言输入");
        }else if(cls.includes(IconCls.delete)){
            me.onDeleteButtonTap(true);
        }else if(cls.includes(IconCls.update)){
            me.onUpdateButtonTap();
        }
        me.onAfterToolTap && me.onAfterToolTap(grid, context, cls, record);
    },

    doDestroy(){
        Ext.destroy(this.toolTapEventListener);
    }

});