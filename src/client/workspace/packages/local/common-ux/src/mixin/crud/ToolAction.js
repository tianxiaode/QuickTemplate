Ext.define('Common.mixin.crud.ToolAction', {
    extend: 'Common.mixin.Component',

    toolTapEventListener: null,

    config:{
        toolActions: {}
    },    

    applyToolActions(actions){
        let me = this,
            ret = Ext.apply({
            [IconCls.language]: me.onMultilingual,
            [IconCls.delete]: me.onDeleteButtonTap.bind(me, true),
            [IconCls.update]: me.onUpdateButtonTap
        }, actions);
        Ext.Object.each(ret, (key, value)=>{
            if(typeof value ==='string'){
                ret[key] = me[value]; 
            }
        });
        return ret;
    },

    onToolTap(grid, context){
        let me = this,
            cls = context.tool.getIconCls(),
            record = context.record;
        me.currentRecord = record;
        Ext.Object.each(me.getToolActions(), (key, value)=>{
            if(cls.includes(key)){
                value.call(me, record);
            }
        })
        me.onAfterToolTap && me.onAfterToolTap(grid, context, cls, record);
    },

    doDestroy(){
        this.destroyMembers('toolActions');
    }

});