Ext.define('Common.ux.grid.column.Highlight', {
    extend: 'Ext.grid.column.Column',
    xtype: 'uxhighlightcolumn',

    requires:[
        'Common.ux.grid.cell.Highlight'
    ],

    config:{
        cell:{
            xtype: 'uxhighlightcell',
            encodeHtml: false
        }
    }

})
