Ext.define('Common.ux.grid.column.Action',{
    extend: 'Ext.grid.column.Column',
    xtype: 'uxactioncolumn',

    autoText: false,
    text: '...',
    menu: false,
    align: 'center',
    width: 60,

    useTranslation: true,
    config:{
        translation:{
            iconCls: 'x-fa fa-globe text-primary',
            handler: 'onMultilingual',
            langTooltip: 'Multilingual',
            weight: 300
        }
    },


    applyCell: function(cell, oldCell) {
        if (oldCell) {
            cell = Ext.apply(oldCell, cell);
        }

        if(this.useTranslation){
            let tools = cell.tools;
            if(!tools) tools = cell.tools = {};
            tools.translation = Ext.clone(this.getTranslation());
        }

        return cell;
    },

})
