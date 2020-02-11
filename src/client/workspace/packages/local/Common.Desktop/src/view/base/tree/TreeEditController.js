Ext.define('Common.Desktop.view.base.tree.TreeEditController',{
    extend: 'Common.Desktop.view.base.form.FormController',
    alias: 'controller.baseTreeEdit',

    beforeRecordSaved: function(record, isNew, eOpts){
        if(!isNew){
            this.getView().setDefaultModelValue({ parentId : record.getId(), parentName: record.get('displayName') })
        }
    }
});
