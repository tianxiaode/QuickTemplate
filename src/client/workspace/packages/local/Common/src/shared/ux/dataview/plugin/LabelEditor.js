Ext.define('Common.shared.ux.dataview.plugin.LabelEditor',{
    extend: 'Ext.Editor',
    alias: 'plugin.dataviewlabeleditor',

    alignment: 'l-l',

    completeOnEnter: true,

    cancelOnEsc: true,

    shim: false,
    
    width: 'auto',
    height: 'field',
    

    labelSelector: 'x-editable',

    config:{
        field:{
            autoLabel: false,
            allowOnlyWhitespace: false,            
            selectOnFocus: true,
            ignoreNoChange: true,
            updateEl: true,
        }
    },

    requires: [
        'Ext.field.Text'
    ],

    init(view) {
        let me= this;
        me.view = view;
        view.element.on('tap', me.onClick, me, {delegate: '.' + me.labelSelector});
        me.on('complete', me.onSave, me);
    },

    // on mousedown show editor
    onClick(e, target) {
        let me = this, 
            record,
            className = target.className;
        if (className.includes(me.labelSelector) && !me.editing && !e.ctrlKey && !e.shiftKey) {
            e.stopEvent();
            record = (e.to && e.to.record) || me.getRecordById(target);
            me.setWidth(target.offsetWidth);
            me.startEdit(target, record.get(me.dataIndex));
            me.activeRecord = record;
        }
        else if (me.editing) {
            me.field.blur();
            e.preventDefault();
        }
    },

    // update record
    onSave(ed, value) {
        this.activeRecord.set(this.dataIndex, value);
    },

    getRecordById(target){
        let id =Ext.fly(target).getAttribute('data-id'),
            view = this.view,
            store = view.getStore();
        return store.getById(id);
    }
})