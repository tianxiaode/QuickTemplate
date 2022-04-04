Ext.define('Common.ux.crud.controller.More', {
    extend: 'Common.ux.crud.controller.Base',

    currentId: null,
    currentEntity: null,
    morePanelType: 'uxmorepanel',

    init(){
        let me = this;
        me.callParent();
        me.getView().on('hiddenchange', me.onViewHiddenChange, me);
    },

    onViewHiddenChange( sender, value, oldValue, eOpts){
        if(value) return;
        this.onRefreshView();
    },

    getRecord(){
        let me = this;
        if(Ext.isEmpty(me.morePanelType)) return null;
        return this.getView().up(me.morePanelType).getRecord();
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
            return;
        }
        store.getProxy().setUrl(URI.crud(me.entityName, id, me.currentEntity));
        store.loadPage(1);
    },


});
 