Ext.define('Common.mixin.Editor', {
    extend: 'Ext.Mixin',

    mixinConfig: {
        after:{
            initialize: 'initialize',
        },                
    },

    labelSelector: 'x-editable',

    initialize(){
        let me  = this;
        if(me.isPhone()) return;
        me.el.on('tap', me.onStartEdit, me, {delegate: '.' + me.labelSelector});

    },

    onStartEdit(e, target) {
        let me = this, 
            editor = me.getEditor(),
            record,
            className = target.className;
        if (className.includes(me.labelSelector) && !me.editing && !e.ctrlKey && !e.shiftKey) {
            e.stopEvent();
            console.log(e,target);
            record = (e.to && e.to.record) || me.getRecordById(target);
            editor.setWidth(target.offsetWidth);
            editor.startEdit(target, record.get(me.dataIndex));
            editor.activeRecord = record;
        }
        else if (me.editing) {
            me.field.blur();
            e.preventDefault();
        }
    },

    getRecordById(target){
        let id =Ext.fly(target).getAttribute('data-id'),
            view = this.view,
            store = view.getStore();
        return store.getById(id);
    },


    getEditor(){
        let me = this,
            editor= me.activeEditor;
        if(editor) return editor;
        editor = me.activeEditor = new Ext.Editor({
            updateEl: true,
            alignment: 'l-l',
            completeOnEnter: true,
            cancelOnEsc: true,        
            shim: false,
            autoSize: {
                width: 'boundEl'
            },
            field: {
                autoLabel: false,
                xtype: 'textfield'
            }
        })
        return editor;
    }
});