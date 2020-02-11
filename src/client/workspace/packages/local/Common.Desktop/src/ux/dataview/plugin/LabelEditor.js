/**
 * 为数据视图添加标签编辑功能
 */
Ext.define('Common.Desktop.ux.dataview.plugin.LabelEditor',{
    extend: 'Ext.Editor',
    alias: 'plugin.dataviewlabeleditor',

    //alignment: 'l-l',

    completeOnEnter: true,

    cancelOnEsc: true,

    shim: false,
    
    width: 'auto',
    height: 'field',

    labelSelector: 'x-editable',

    config:{
        field:{
            allowOnlyWhitespace: false,
            selectOnFocus: true
        }
    },

    requires: [
        'Ext.field.Text'
    ],

    init: function(view) {
        let me= this;
        me.view = view;
        me.mon(view, 'painted', me.bindEvents, me);
        me.on('complete', me.onSave, me);
    },

    // initialize events
    bindEvents: function() {
        this.mon(this.view.element, {
            tap: {
                fn: this.onClick,
                scope: this
            }
        });
    },

    // on mousedown show editor
    onClick: function(e, target) {
        var me = this,
            item, record;

        if (Ext.fly(target).hasCls(me.labelSelector) && !me.editing && !e.ctrlKey && !e.shiftKey) {
            e.stopEvent();
            record = e.from.record;
            
            me.startEdit(target, record.get(me.dataIndex));
            me.activeRecord = record;
        }
        else if (me.editing) {
            me.field.blur();
            e.preventDefault();
        }
    },

    // update record
    onSave: function(ed, value) {
        this.activeRecord.set(this.dataIndex, value);
    }
})