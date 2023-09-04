Ext.define('Common.mixin.data.Model',{
    extend: 'Ext.Mixin',

    mixinConfig: {
        configs: true,
        before:{
            applyModel: 'applyModel',
            doDestroy: 'doDestroy'
        }
    },

    applyModel(model) {
        let me = this,
            m = model;
        if(Ext.isEmpty(m)) return model;
        m = Ext.data.schema.Schema.lookupEntity(m);
        let fields = m.getFields();
        me.localFilterFields =[];
        me.sortFields = {};
        me.langText = {};
        fields.forEach(field => {
            if(field.messageField) me.messageField = field.name;
            if(field.localFilter) me.localFilterFields.push(field.name);
            if(field.allowSort) me.sortFields[field.name] = true;
            if(field.langText) me.langText[field.name] = field.langText;
        });
        return model;
    },    

    doDestroy(){
        let me = this;
        me.localFilterFields = null;
        me.sortFields = null;
        me.langText = null;
    }
})