Ext.define('Common.shared.plugins.RelateField',{
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.relatefield',

    relateField: null,
    relateFieldContainer: 'formpanel',
    convertFn: null,

    config:{
        field: null
    },

    init(cmp) {
        var me = this;
        me.setField(cmp);
        cmp.on('change', me.setRelateFieldValue, me);
    },

    setRelateFieldValue(sender, newValue,old, eOpts) {
        let me = this,
            cmp = me.getField(),
            relateField = me.relateField,
            container = me.relateFieldContainer,
            convertFn = me.convertFn,
            fn = Ext.isString(convertFn) ? Format[convertFn] : convertFn;
        if(Ext.isEmpty(relateField) || Ext.isEmpty(container)) return;
        let field = cmp.up(container).down(`field[name=${relateField}],field[searchName=${relateField}]`);
        if(!field) return;
        if(Ext.isEmpty(convertFn)) {
            field.setValue(newValue);
            return;
        };
        field.setValue(fn.call(me, newValue));

    },

})