Ext.define('Common.mixin.grid.ActionColumn', {
    extend: 'Common.mixin.Component',

    requires: [
        'Common.service.IconCls'
    ],

    config: {
        translationTool: null,
        updateTool: {},
        deleteTool: {},
        actionColumn: {}
    },


    createActionColumn(config) {
        let me = this,
            cell = config.cell || {},
            tools = cell.tools || {},
            translationTool = me.getTranslationTool(),
            updateTool = me.getUpdateTool(),
            deleteTool = me.getDeleteTool();
        delete config.cell;
        if(translationTool){
            tools.translation = Ext.apply({
                iconCls: IconCls.language +' color-base mx-1',
                langTooltip: 'Multilingual',
                actionName: 'translation',
                hidden: true,
                weight: 300,    
            }, translationTool);
        }
        if(updateTool){
            tools.update = Ext.apply({
                iconCls: IconCls.update +' color-base mx-1',
                langTooltip: 'Edit',
                actionName: 'update',
                weight: 100,    
                hidden: true,
            }, updateTool);
        }
        if(deleteTool){
            tools.delete = Ext.apply({
                iconCls: IconCls.delete +' color-alert mx-1',
                langTooltip: 'Delete',
                actionName: 'delete',
                weight: 200,    
                hidden: true,
            }, deleteTool);
        }
        Ext.Object.each(tools, (key, tool)=>{
            if(!tool.iconCls.includes('mx-1')) tool.iconCls = tool.iconCls +' mx-1';
            tool.handler = me.onToolTap.bind(me);
        });
        cell.tools = tools;
        return Ext.apply({
            xtype: 'gridcolumn',
            autoText: false,
            text: '...',
            menu: false,
            align: 'center',
            renderer: me.onActionColumnRenderer.bind(me),
            cell: cell,
        }, config);
    },

    applyActionColumn(config, old) {
        return Ext.updateWidget(old, config, this, 'createActionColumn');
    },

    afterInitialize() {
        let me = this,
            columns = me.getColumns(),
            ln = columns.length,
            actionColumn = me.getActionColumn();
        actionColumn &&me.insertColumn(ln, actionColumn);
    },

    onActionColumnRenderer(value, record, dataIndex, cell, column) {
        let permissions = this.up('[permissions]').permissions,
            tools = cell.getTools();
        Ext.each(tools, tool=>{      
            let cls = tool.getIconCls();
            if(cls.includes(IconCls.language)) {
                tool.setHidden(!permissions.update);
            }else if(cls.includes(IconCls.update)) {
                tool.setHidden(!permissions.update);
            }else if(cls.includes(IconCls.delete)) {
                tool.setHidden(!permissions.delete);
            }
        })
        return '';
    },

    onToolTap(grid, context){
        this.fireEvent('tooltap', grid, context);
    },

    doDestroy() {
        this.destroyMembers('actionColumn', 'translationTool', 'updateTool', 'deleteTool');
    }


})