Ext.define('Common.shared.ux.field.CultureName',{
    extend: 'Ext.field.Select',
    xtype: 'uxculturenamefield',

    initialize(){
        let me = this;
        me.callParent();
        me.initData();
    },

    initData(){
        let me = this,
            data =[];
        I18N.getLanguages().forEach(l=>{
            data.push({ text: l.displayName, value: l.cultureName})
        });
        me.setOptions(data);
        me.setValue(data[0].value);
    }

})