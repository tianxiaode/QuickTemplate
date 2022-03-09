Ext.define('Common.shared.app.DetailInMoreController', {
    extend: 'Ext.app.ViewController',

    currentId: null,
    currentEntity: null,
    morePanelType: 'uxmorepanel',

    init(){
        let me = this;
        me.callParent(arguments);
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
            view = me.getView(),
            record = me.getRecord(),
            id =  record && record.getId();
        if(id === me.currentId) return;
        me.currentId = id;
        me.resourceName = view.resourceName;
        me.entityName = view.entityName;
    },


});
 