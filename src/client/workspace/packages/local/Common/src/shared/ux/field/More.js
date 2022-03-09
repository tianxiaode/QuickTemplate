Ext.define('Common.shared.ux.field.More',{
    extend: 'Ext.field.Text',
    xtype: 'uxmorefield',

    requires:[
        'Common.shared.ux.field.trigger.More',
        'Common.shared.ux.panel.MoreDialog',
    ],

    triggers: {
        more: {
            type: 'more',
            hidden: false,
        }
    },    

    onMoreIconTap(){
        let me = this,
            cell = me.up().up(),            
            column = cell.getColumn(),
            record = cell.getRecord(),
            dlg = ViewMgr.get('moredialog');
        if(!me.hasBindSaveEvent){
            dlg.on('saved', me.onMoreDialogSaved, me);
            me.hasBindSaveEvent = true;
        }
        dlg.setTitle(`${column.getText()} - ${record.get('language')}`)
        dlg.setFieldValue(me.getValue());
        dlg.show();
        //dlg.setTitle(text);
    },

    onMoreDialogSaved(sender , value){
        let me = this,
            cell = me.up().up(),            
            column = cell.getColumn(),
            record = cell.getRecord();
        record.set(column.getDataIndex(),value);
    }
})