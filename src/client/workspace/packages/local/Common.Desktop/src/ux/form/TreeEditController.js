Ext.define('Common.Desktop.ux.form.TreeEditController',{
    extend: 'Common.Desktop.view.base.form.FormController',
    alias: 'controller.treeedit',

    beforeRecordSaved: function(record, isNew, eOpts){
        if(!isNew){
            this.getView().setDefaultModelValue({ parentId : record.getId(), parentName: record.get('displayName') })
        }
    }
});
