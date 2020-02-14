Ext.define('Common.Desktop.ux.form.TreeEdit',{
    extend: 'Common.Desktop.ux.form.Dialog',
    xtype: 'treeeditview',

    requires:[
        'Ext.field.Display',
        'Common.Data.model.SearchTree',
        'Common.Desktop.ux.form.TreeEditController'
    ],

    controller: 'treeedit',
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