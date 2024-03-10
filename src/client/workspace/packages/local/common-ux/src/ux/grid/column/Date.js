Ext.define('Common.ux.grid.column.Date', {
    extend: 'Ext.grid.column.Column',
    xtype: 'uxdatecolumn',

    isDateColumn: true,

    requires: [
        'Ext.Date',
        'Common.ux.grid.cell.Date'
    ],

    config: {
        /**
         * @cfg {String} format (required)
         * A format string as used by {@link Ext.Date#format} to format values for this
         * column.
         */
        format: 'datetime',

        defaultEditor: {
            xtype: 'datepickerfield'
        },

        cell: {
            xtype: 'uxdatecell',
            encodeHtml: false
        },

        summaries: {
            min: true,
            max: true,
            count: false
        },

        showCheckbox: false

    },

    applyFormat(format){
        if(format === 'date') return Format.defaultDateFormat;
        if(format === 'datetime') return Format.defaultDateTimeFormat;
        return format;
    },

    initialize(){
        let me = this,
            format = me.getFormat();
        me.callParent();
        if(format === Format.defaultDateFormat) me.setWidth(120);
        if(format === Format.defaultDateTimeFormat) me.setWidth(180);
    }
});
