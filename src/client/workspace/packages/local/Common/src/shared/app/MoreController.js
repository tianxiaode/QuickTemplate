Ext.define('Common.app.MoreController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.shared-morecontroller',

    mainReferenceName: 'mainPanel',
    moreReferenceName: 'morePanel',

    init(){
        let me = this;
        me.list = me.lookup(me.mainReferenceName);
        me.more = me.lookup(me.moreReferenceName);
        me.list.on('select', me.onGridSelected, me);
        me.list.on('deselect', me.onGridDeselected, me);
        me.more.updateRecord(null);
    },

    onGridSelected(sender,  selected, eOpts){
        let me = this,
            selection = me.getCurrentSelected();
        me.more.setRecord(selection);
        //me.getViewModel().set('selection', selection)
    },

    onGridDeselected(sender, records, eOpts){
        let me = this,
            selection = me.getCurrentSelected();
        me.more.setRecord(selection);
        //me.getViewModel().set('selection', selection)
    },

    getCurrentSelected(){
        let me = this;
        return me.list.getSelectable().getSelections()[0];
    },


});