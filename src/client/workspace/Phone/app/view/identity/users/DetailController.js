Ext.define('Phone.view.identity.users.DetailController', {
    extend: 'Common.ux.app.DetailInMoreController',
    alias: 'controller.phone-userdetailcontroller',

    updateItemText(record , name ,field, value){
        this.callParent(arguments);
        
    },

    editField:{
        name: 'text',
        barcode: 'text',
        unit: 'text',
        brand: 'text',
        specifications: 'text',
        category: 'category',
        ageLimit: 'int', 
        memberPrice: 'float',
        salesPrice: 'float' , 
        description: 'textarea'
    },

    onChildTap(sender,location){
        let me = this,
            record = me.getRecord(),
            target = location.sourceElement;            
        if(target.tagName === 'P') target = target.parentElement;
        if(!(record && record.get('editable'))) return;
        if(!Format.checkTargetCls(target, 'x-editable'))return;

        let field = location.record.getId(),
            type = me.editField[field];
        if(Ext.isEmpty(type)) return;
        let dlg = me.getEditDialog(),
            action = Format.splitCamelCase(field);
        dlg.setUrl(URI.crud(me.entityName, record.getId(), action));
        let value = record.get(field);
        if(field.includes('Price')) value = value/100;
        dlg.setField(field, type, value);
        dlg.show();
    },

    getEditDialog(){
        let me = this,
            dlg = me.editDialog;
        if(!dlg){
            dlg = me.editDialog = Ext.create({
                xtype: 'phone-productdetailedit', 
                resourceName: me.resourceName,
                listeners:{ saved: me.updateFieldSuccess, scope: me }});
        }
        return dlg;
    },

    getViewParams(){
        let me = this;
        return {
            entityName:  me.entityName, 
            resourceName: me.resourceName,
            includeResource: true,
        }
    },

    updateFieldSuccess(sender, field , value){
        let me = this,
            record = me.getRecord();
        if(field.includes('Price')) value = value *100;
        record.set(field, value);
        record.commit();
        me.refreshList();
    },

});