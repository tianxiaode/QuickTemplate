Ext.define('Common.Desktop.view.base.tree.TreeEdit',{
    extend: 'Common.Desktop.view.base.form.Form',
    xtype: 'treeEditView',

    requires:[
        'Ext.field.Display',
        'Common.Data.model.SearchTree',
        'Common.Desktop.view.base.tree.TreeEditController'
    ],

    controller: 'baseTreeEdit',
    entityName: 'SearchTree',
    items:[
        { xtype: 'hiddenfield', name:'id'},
        { xtype: 'hiddenfield', name:'parentId'},
        { xtype: 'displayfield', name: 'parentName' ,autoLabel: false },
        { name: 'displayName', maxLength: 128}
    ],

    initialize(){
        let me = this;
        me.callParent();
        me.down('displayfield').setLabel(I18N.Parent+ me.getDefaultTitle() + I18N.LabelSeparator);
    }


});