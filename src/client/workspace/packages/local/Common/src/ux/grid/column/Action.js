Ext.define('Common.ux.grid.column.Action', {
    extend: 'Ext.grid.column.Column',
    xtype: 'uxactioncolumn',

    autoText: false,
    text: '...',
    menu: false,
    align: 'center',
    width: 60,

    config: {
        translation: {
            iconCls: 'x-fa fa-globe text-primary',
            handler: 'onMultilingual',
            langTooltip: 'Multilingual',
            weight: 300
        }
    },


    applyCell(cell, oldCell) {
        if (oldCell) {
            cell = Ext.apply(oldCell, cell);
        }

        let translation = me.getTranslation();

        if (translation) {
            let tools = cell.tools;
            if (!tools) tools = cell.tools = {};
            tools.translation = Ext.clone(translation);
        }

        return cell;
    },

    doDestroy() {
        let me = this;
        me.setTranslation(null);
        me.callParent();
    }

})
