Ext.define('Common.ux.grid.cell.Date', {
    extend: 'Ext.grid.cell.Date',
    xtype: 'uxdatecell',

    formatValue(value) {
        let column = this.getColumn(),
            showCheckbox = column.getShowCheckbox(),
            dateFormat = this.getFormat(),
            formatValue = Ext.isDate(value) && Ext.Date.format(value, dateFormat);
        if(showCheckbox){
            let checked = !!value,
                checkedCls = checked ?  Format.checkCls : '',
                text = value ? formatValue : '';
            return Format.format(Template.checkBoxItem, value, text, checkedCls, column.getDataIndex());
        }
        return value ? ( formatValue || value) : '';
    }

});
