Ext.define('Common.ux.app.MoreController', {
    extend: 'Common.ux.app.ViewController',
    alias: 'controller.uxmorecontroller',

    crudPanel: '[isCrudPanel]',
    morePanel: '[isMorePanel]',

    init(){
        let me = this
            view = me.getView();
        me.list = view.down(me.crudPanel).down('[isCrudList]');
        me.more = view.down(me.morePanel);
        me.list.on('select', me.onListSelected, me);
        me.list.on('deselect', me.onListDeselected, me);
        me.more.updateRecord(null);
    },

    onListSelected(sender,  selected, eOpts){
        let me = this,
            selection = me.getCurrentSelection();
        me.more.setRecord(selection);
    },

    onListDeselected(sender, records, eOpts){
        let me = this,
            selection = me.getCurrentSelection();
        me.more.setRecord(selection);
    },

    getCurrentSelection(){
        let me = this;
        return me.list.getSelectable().getSelections()[0];
    },


});