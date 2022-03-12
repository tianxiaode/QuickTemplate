Ext.define('Common.ux.grid.cell.LongPress',{
    extend: 'Ext.grid.cell.Cell',
    xtype: 'uxlongpresscell',

    requires:[
        'Ext.TaskManager'
    ],

    config:{
        delegateCls: null
    },

    encodeHtml: false,

    updateDelegateCls(cls){
        if(Ext.isEmpty(cls)) return;
        let me = this,
            el = me.el;
        el.on('longpress', me.onLongPress, me, { delegate: cls});
        el.on('touchend', me.onTouchEnd, me, { delegate: cls});
        return cls;
    },

    getTask(){
        let me = this,
            task = me.task;
        if(!task){
            task = me.task = {
                run: me.updateFieldValue,
                interval: 50,
                scope: me
            }
        }
        return task;
    },

    onLongPress(e, source){
        let me = this,
            task = me.getTask();
        me.isLongPress = true;
        me.updateParams = me.getUpdateParams(source);
        me.count = 0;
        Ext.TaskManager.start(task);
    },

    onTouchEnd(e, source){
        let me = this,
            record = me.getRecord();
        if(!record.get('editable')) return;
        if(me.isLongPress){
            let task = me.getTask();
            Ext.TaskManager.stop(task);
            me.isLongPress = false;
            let params = me.updateParams;
            me.fireEvent('updatedata',me, record, params.field );
            return;
        }
        me.updateParams = me.getUpdateParams(source);
        me.updateFieldValue();
        me.fireEvent('updatedata',me, record, me.updateParams.field );
    },

    getUpdateParams(el){
        let field = el.getAttribute('data-field'),
            dir = el.className.includes('left') ? -1 : 1;
        return { field: field, dir: dir};
    },

    updateFieldValue(){
        let me = this,
            record  = me.getRecord(),
            params = me.updateParams,
            field = record.fieldsMap[params.field];
        if(!field) return;
        let old = record.get(params.field),
            value = old + params.dir;
        if(params.dir === -1){
            let min = field.minValue;
            if(Ext.isString(min)) min = record.get(min);
            if(value < min) return;            
            record.set(params.field, value);
            return;
        }
        let max = field.maxValue;
        if(Ext.isString(max)) max = record.get(max);
        if(value> max) return;
        record.set(params.field, value);
    },



})
 