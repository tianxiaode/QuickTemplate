Ext.define('Common.shared.ux.field.ResourceName',{
    extend: 'Ext.field.Select',
    xtype: 'uxresourcenamefield',

    initialize(){
        let me = this;
        me.callParent();
        me.initData();
    },

    initData(){
        let me = this,
            data =[];
        I18N.getResourceName().sort().forEach(l=>{
            if(l === 'Permissions' || l === 'Roles') return;
            data.push({ text:l, value: l})
        });
        me.setOptions(data);
        me.setValue(data[0].value);
    }

})