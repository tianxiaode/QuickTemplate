Ext.define('Common.ux.CountMessage',{
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
        me.setHtml(Format.format(I18N.get('CountMessage'), `<span class="color-base">${me.getCount()}</span>`));
    }
})