Ext.define('Common.shared.ux.data.TreeStore', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.uxformattreestore',

    requires:[
        'Common.data.model.TreeBase'
    ],

    model: 'Common.data.model.TreeBase',

    updateAction:{},
    entity: null,
    controller: null,

    rootVisible: false,
    remoteFilter: true,

    proxy: {
        type: 'format',
    },

    applyModel(model) {
        let me = this;
        model = me.callParent(arguments);
        let fields = model.getFields();
        fields.forEach(field => {
            if(field.messageField) me.messageField = field.name;
            if(field.updateAction) me.updateAction[field.name] = field.updateAction;
        });
        return model;
    },    

    applyProxy(proxy) {
        let me = this,
            entity = me.entity;
        if(Ext.isEmpty(entity)){
            let model = me.getModel();
            entity = model.entityName;
            let index = entity.indexOf('.');
            if(index>0) entity = entity.substr(index+1);
        }
        Ext.apply(proxy,{ entity: entity, controller: me.controller});
        return me.callParent(arguments);
    },

});
