Ext.define('Common.ux.crud.controller.More', {
    extend: 'Common.ux.crud.controller.Base',

    currentId: null,
    currentEntity: null,
    morePanel: '[isMorePanel]',

    init(){
        let me = this;
        me.callParent();
        me.updateToolbarItem(true);
        me.getView().on('hiddenchange', me.onViewHiddenChange, me);
    },

    onViewHiddenChange( sender, value, oldValue, eOpts){
        if(value) return;
        this.onRefreshView();
    },

    getRecord(){
        return this.getView().up(this.morePanel).getRecord();
    },

    isEditable(){
        let record = this.getRecord();
        return record && record.get('editable');
    },

    onRefreshView(){
        let me = this,
            record = me.getRecord(),
            id =  record && record.getId();
        me.initButtons();
        me.updateButtons();
        if(id === me.currentId) return;
        me.currentId = id;
        me.onRefreshStore();
        me.initButtons();
        me.updateButtons();
        me.updateToolbarItem(!id);
    },

    updateToolbarItem(disabled){
        Ext.each(this.getView().getToolbar().getItems().items, item=>{
            item.setDisabled(disabled);
        })
    },

    onRefreshStore(){
        let me = this,
            store = me.list && me.list.getStore(),
            isChainedStore = store && store.isChainedStore || false,
            id = me.currentId;
        if(isChainedStore) store = store.source;
        if(!store) {
            Ext.defer(me.onRefreshStore, 50, me);
            return;
        };
        if(Ext.isEmpty(id)){
            store.removeAll();
            store.commitChanges();
            store.getProxy().setUrl(null);
            me.updateToolbarItem(true);
            return;
        }
        store.getProxy().setUrl(URI.crud(me.entityName, id, Format.pluralize(me.currentEntity)));
        store.loadPage(1);
    },

    getCheckChangeUrl(entityName, id, action, checked){
        let me = this;
        return checked === undefined 
            ? URI.crud(entityName,me.currentId, me.currentEntity, id, action)
            : URI.crud(entityName,me.currentId, me.currentEntity,id,action, checked)
    },


}); 