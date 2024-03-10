Ext.define('Common.mixin.grid.ActionColumn', {
    extend: 'Common.mixin.Component',

    config: {
        translationTool: {},
        updateTool: {},
        deleteTool: {},
        actionColumn: {}
    },


    createActionColumn(config) {
        let me = this,
            tools = [],
            translationTool = me.getTranslationTool(),
            updateTool = me.getUpdateTool(),
            deleteTool = me.getDeleteTool();
        if(translationTool){
            tools.push(Ext.apply({
                iconCls: 'x-fa fa-globe color-base mx-1',
                langTooltip: 'Multilingual',
                actionName: 'onMultilingual',
                hidden: true,
                handler:  me.onTranslationToolTap.bind(me),
                weight: 300,    
            }, translationTool));
        }
        if(updateTool){
            tools.push(Ext.apply({
                iconCls: 'x-fa fa-edit color-base mx-1',
                langTooltip: 'Edit',
                actionName: 'onUpdateButtonTap',
                handler:  me.onUpdateToolTap.bind(me),
                weight: 100,    
                hidden: true,
            }, updateTool));
        }
        if(deleteTool){
            tools.push(Ext.apply({
                iconCls: 'x-fa fa-trash color-alert mx-1',
                langTooltip: 'Delete',
                handler:  me.onDeleteToolTap.bind(me),
                actionName: 'onDeleteButtonTap',
                weight: 200,    
                hidden: true,
            }, deleteTool));
        }
        return Ext.apply({
            xtype: 'gridcolumn',
            autoText: false,
            text: '...',
            menu: false,
            align: 'center',
            renderer: me.onActionColumnRenderer.bind(me),
            cell:{
                tools: tools
            },
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
            if(tool.actionName === 'onMultilingual' ) {
                tool.setHidden(!permissions.update);
            }
            if(tool.actionName === 'onUpdateButtonTap' ) {
                tool.setHidden(!permissions.update);
            }
            if(tool.actionName === 'onDeleteButtonTap' ) {
                tool.setHidden(!permissions.delete);
            }
        })
        Logger.debug(this.onActionColumnRenderer, arguments);
        return '';
    },

    onTranslationToolTap(grid, context){
        this.onToolAction(context.tool.actionName, grid, context);
    },    

    onUpdateToolTap(grid, context){
        this.onToolAction(context.tool.actionName, grid, context);
    },

    onDeleteToolTap(grid, context){        
        Logger.debug(this.onDeleteToolTap, grid, context);
        this.onToolAction(context.tool.actionName, grid, context);
    },

    onToolAction(action, grid, context){
        let container = this.up(`{${action}()}`);
        if(!container) Ext.raise(`没有混入${action}操作的容器`);
        let handler = container[action];
        container.currentRecord = context.record;
        handler(true);
    },

    doDestroy() {
        this.destroyMembers('actionColumn', 'translationTool', 'updateTool', 'deleteTool');
    }


})