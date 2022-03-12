Ext.define('Common.ux.data.Store', {
    extend: 'Ext.data.Store',
    alias: 'store.uxformatstore',

    requires:[
        'Common.ux.data.proxy.Format'
    ],

    updateAction:{},
    checkAction:{},
    uncheckAction:{},
    entity: null,
    controller: null,
    remoteSort: true,
    remoteFilter: true,
    localFilterFields:[],
    filterValue: null,
    pageSize: 25,
    proxy: {
        type: 'format',
    },

    applyModel(model) {
        let me = this;
        model = me.callParent(arguments);
        if(Ext.isEmpty(model)) return model;
        let fields = model.getFields();
        fields.forEach(field => {
            if(field.messageField) me.messageField = field.name;
            if(field.updateAction) me.updateAction[field.name] = field.updateAction;
            if(field.checkAction) me.checkAction[field.name] = field.checkAction;
            if(field.uncheckAction) me.uncheckAction[field.name] = field.uncheckAction;
            if(field.localFilter) me.localFilterFields.push(field.name);
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
        return me.callParent([proxy]);
    },

});
