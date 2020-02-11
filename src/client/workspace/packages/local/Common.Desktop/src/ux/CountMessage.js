/**
 * 数据总数显示组件
 */
Ext.define('Common.Desktop.ux.CountMessage',{
    extend: 'Ext.Component',
    xtype: 'uxcountmessage',

    config:{
        count: 0
    },


    applyCount(count){
        let me = this;
        me.setHtml(Ext.String.format(I18N.Count, count));
        return count;
    }

})