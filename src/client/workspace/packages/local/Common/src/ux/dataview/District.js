Ext.define('Common.ux.dataview.SelectItem',{
    extend: 'Ext.dataview.DataView',
    xtype: 'uxselectitemlist',

    rowLines: true,
    striped: false,
    userCls: 'listing', 
    inline: true,
    itemTpl:`
        <div class="p-2">{displayName:translationItem(values,'displayName')}</div>
    `

   
})