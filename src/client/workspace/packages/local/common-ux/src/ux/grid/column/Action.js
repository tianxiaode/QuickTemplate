Ext.define('Common.ux.grid.column.Action', {
    extend: 'Ext.grid.column.Column',
    xtype: 'uxactioncolumn',

    autoText: false,
    text: '...',
    menu: false,
    align: 'center',

    applyCell(cell, oldCell) {
        let me = this,
            tools = cell.tools || {};
        if (oldCell) {
            cell = Ext.apply(oldCell, cell);
        }
        
        if(me.isTranslation){
            tools.translation = {
                iconCls: 'x-fa fa-globe color-base',
                handler:  'onTranslationToolTap',
                langTooltip: 'Multilingual',
                weight: 300
            }
        }

        if(me.isUpdate){
            tools.update = {
                iconCls: 'x-fa fa-edit color-base',
                handler: 'onUpdateToolTap',
                langTooltip: 'Edit',
                weight: 100
            }
        }

        if(me.isDelete){
            tools.delete = {
                iconCls: 'x-fa fa-trash color-alert',
                handler: 'onDeleteToolTap',
                langTooltip: 'Delete',
                weight: 200
            }
        }

        !Ext.Object.isEmpty(tools) && (cell.tools = tools);

        return cell;
    },

    initialize(){
        let me = this,
            cell = me.getCell(),
            container = me.getGrid().up(`[isToolAction]}`);
            tools = cell.tools || {};
        Logger.debug(this.initialize, tools, container);
        Ext.Object.each(tools, (key,tool) => {
            let handler = tool.handler;
            if (Ext.isString(handler)) {
                let fn = container[handler];
                if (fn) tool.handler = fn;
            }
        });
        me.callParent(arguments);

    },


    doDestroy() {}

})
