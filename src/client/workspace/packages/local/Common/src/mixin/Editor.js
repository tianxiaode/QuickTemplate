Ext.define('Common.mixin.Editor', {
    extend: 'Ext.Mixin',

    requires:[
        'Ext.Editor',
        'Common.ux.field.plugin.More',
        'Common.ux.field.Date',
        'Common.ux.field.DateTime',
    ],

    mixinConfig: {
        after:{
            initialize: 'initialize',
            doDestroy: 'doDestroy',
        },                
    },

    labelSelector: 'x-editable',
    editorMap: null,

    initialize(){
        let me  = this;
        if(me.isPhone()) return;
        me.el.on('tap', me.onStartEdit, me, {delegate: '.' + me.labelSelector});

    },

    onStartEdit(e, target) {
        let me = this, 
            className = target.className,
            record =  (e.to && e.to.record) || me.getRecordById(target)
            editor = me.getEditor(record.get('inputType'));
        if (className.includes(me.labelSelector)&& !editor.editing && !e.ctrlKey && !e.shiftKey) {
            let field = editor.getField();
            field.setDecimals && field.setDecimals(record.get('decimals') || 2);
            e.stopEvent();
            editor.setWidth(target.offsetWidth);
            editor.startEdit(target, record.get(me.dataIndex));
            editor.getField().setValue(record.get('value'));
            editor.activeRecord = record;
        }
        else if (editor.editing) {
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


    getEditor(type){
        let me = this,
            map = me.editorMap || {} ,
            editor = map[type],
            config;
        if(editor) return editor;
        config = me.getEditorConfig(type);
        editor = map[type] = Ext.create(config);
        editor.on('complete', me.onCompleteEdit, me);
        return editor;
    },

    onCompleteEdit(editor, value, startValue, eOpts){
        let record = editor.activeRecord;
        console.log(record);
        record.set('value', value);
        record.commit();
    },

    editorConfig:{
        xtype: 'editor',
        updateEl: true,
        alignment: 'l-l',
        completeOnEnter: true,
        cancelOnEsc: true,        
        shim: false,
        autoSize: {
            width: 'boundEl'
        },
    },

    getEditorConfig(type){
        let me = this,
            config = Ext.clone(me.editorConfig),
            field = { xtype: 'textfield', autoLabel: false };
        if(type === 'more'){
            field = Ext.apply(field, { plugins:[ { type: 'fieldmore'}] });            
        }
        if( type === 'number'){
            field = Ext.apply(field, { xtype: 'numberfield'});
        }
        if( type === 'date'){
            field = Ext.apply(field, { xtype: 'uxdatefield'});
        }
        if( type === 'datetime'){
            field = Ext.apply(field, { xtype: 'uxdatetimefield'});
        }
        config.field = field;
        return config;
    },

    doDestroy(){
        let me = this,
            map = me.editorMap;
        Ext.iterate(map, (k,value)=>{
            map[k] = null;
            delete map[k];
        });
        map = null;
    }


});