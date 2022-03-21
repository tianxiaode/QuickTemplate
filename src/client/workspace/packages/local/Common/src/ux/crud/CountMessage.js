Ext.define('Common.ux.crud.CountMessage',{
    extend: 'Ext.Component',
    xtype: 'uxcountmessage',

    config:{
        count: 0,
    },

    updateCount(){
        this.onLocalized();        
    },

    onLocalized(){
        let me = this;
        me.callParent();
        me.setHtml(Format.format(I18N.get('CountMessage'),me.getCount()));
    }
})